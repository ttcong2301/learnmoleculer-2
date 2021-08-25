const { MoleculerError } = require('moleculer').Errors;
const _ = require('lodash');
const axios = require('axios');
const Numeral = require('numeral');

const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');
const PaymentConstant = require('../constants/PaymentConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		let authInfo = ctx.meta.auth.credentials;

		authInfo = await this.broker.call('auth.default', authInfo);

		const { transaction } = payload;

		let orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOneAndUpdate', [{
			transaction,
			state: MiniProgramOrderConstant.STATE.PENDING,
		}, {
			state: MiniProgramOrderConstant.STATE.SUCCEEDED,
		}, {
			new: true,
		}]);

		if (_.get(orderInfo, 'id', null) === null) {
			return {
				code: 1001,
				data: {
					message: 'Không tìm thấy order',
				},
			};
		}
		const historyObj = {
			accountId: authInfo.accountId,
			service: {
				type: MiniProgramOrderConstant.SERVICE_TYPE.MINI_PROGRAM_ORDER_PAYMENT,
				id: orderInfo.id,
				transaction,
				state: orderInfo.state,
				name: 'Thanh toán Mini Program Order',
				data: {
					resolveType: 'MiniProgramObject',
					miniProgramOrderId: orderInfo.id,
					transaction,
					accountId: authInfo.accountId,
					state: orderInfo.state,
				},
			},
			appId: authInfo.appId || 0,
			amount: orderInfo.amount,
			fee: orderInfo.fee,
			total: orderInfo.total,
			state: 'PENDING',
			description: `Thanh toán Mini Program ${Numeral(orderInfo.amount).format('0,0')}VNĐ.`,
			changed: '-',
			tags: [],
		};
		let history = await this.historyService.Post('/v3/History/Service', {
			method: 'CREATE',
			src: historyObj,
		});

		history = _.get(history, 'data.data.history');

		if (_.get(history, 'id', null) === null) {
			orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOneAndUpdate', [{
				transaction,
			}, {
				state: MiniProgramOrderConstant.STATE.FAILED,
			}, {
				new: true,
			}]);
			return {
				succeeded: false,
				data: {
					message: 'Tạo lệnh thanh toán Mini Program thất bại, vui lòng thử lại sau (E002)',
				},
			};
		}

		const paramsPayment = {
			accountId: authInfo.accountId,
			appId: authInfo.appId || 1,
			amount: orderInfo.total,
			service: {
				code: MiniProgramOrderConstant.SERVICE_TYPE.MINI_PROGRAM_ORDER_PAYMENT,
				type: MiniProgramOrderConstant.SERVICE_TYPE.MINI_PROGRAM_ORDER_PAYMENT,
				transaction,
			},
			description: orderInfo.description,
			payment: payload.payment,
		};

		console.log('paramsPayment', paramsPayment);

		const paymentResponse = await this.broker.call('v1.Payment.Pay', paramsPayment);
		console.log('paymentResponse', paymentResponse);

		if (
			[
				PaymentConstant.STATE.FAILED,
				PaymentConstant.STATE.INVALID_PARAMS,
				PaymentConstant.STATE.BALANCE_NOT_ENOUGHT,
			].includes(paymentResponse.state)
		) {
			orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOneAndUpdate', [{
				transaction,
				state: MiniProgramOrderConstant.STATE.SUCCEEDED,
			}, {
				state: MiniProgramOrderConstant.STATE.PENDING,
			}, {
				new: true,
			}]);
			history = await this.historyService.Post('/v1/HistoryAPI/Service', {
				method: 'UPDATE',
				src: {
					accountId: authInfo.accountId,
					'service.transaction': transaction,
					state: MiniProgramOrderConstant.STATE.SUCCEEDED,
				},
				dest: {
					state: MiniProgramOrderConstant.STATE.FAILED,
				},
			});
			history = _.get(history, 'data.data.history');
			return {
				code: 1001,
				data: {
					message: 'Thanh toán Mini Program thất bại',
				},
			};
		}

		if (paymentResponse.state === PaymentConstant.STATE.SUCCEEDED) {
			history = await this.historyService.Post('/v1/HistoryAPI/Service', {
				method: 'UPDATE',
				src: {
					'service.transaction': transaction,
					state: MiniProgramOrderConstant.STATE.SUCCEEDED,
				},
				dest: {
					balance: paymentResponse.balance,
					payment: paymentResponse.payment,
				},
			});
			history = _.get(history, 'data.data.history');

			const ipnState = await axios.post(orderInfo.ipnUrl, {
				state: 'SUCCEEDED',
				amount: orderInfo.amount,
				transaction: orderInfo.partnerTransaction,
				phone: authInfo.phone,
			});

			console.log('ipnState', ipnState);

			return {
				code: 1000,
				data: {
					message: 'Thanh toán thành công',
					orderInfo,
					redirectUrl: orderInfo.redirectUrl,
					failedUrl: orderInfo.failedUrl,
				},
			};
		}

		return {
			code: 1000,
			data: {
				message: paymentResponse.message,
				payment: paymentResponse,
				historyId: history.id,
			},
		};

		// const paymentResponse = await this.broker.call();

		// // Trường hợp yêu cầu otp từ linked bank
		// if (paymentResponse.state === PaymentConstant.STATE.REQUIRED_OTP) {
		// 	// cần OTP từ bank
		// 	response.message = 'Vui lòng nhập OTP';
		// 	response.historyId = history.id;
		// 	response.payment = paymentResponse;
		// 	return response;
		// }
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Pay: ${err.message}`);
	}
};
