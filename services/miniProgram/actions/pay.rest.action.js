const { MoleculerError } = require('moleculer').Errors;
const _ = require('lodash');
const axios = require('axios');
const Numeral = require('numeral');

const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');
const PaymentConstant = require('../constants/PaymentConstant');
const FrontendConstant = require('../constants/FrontendConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		let authInfo = ctx.meta.auth.credentials;

		authInfo = await this.broker.call('auth.default', authInfo);

		const { transaction } = payload;

		let orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOne', [{
			transaction,
			state: MiniProgramOrderConstant.STATE.PENDING,
		}]);

		if (_.get(orderInfo, 'id', null) === null) {
			return {
				code: 1001,
				data: {
					message: 'Không tìm thấy order',
				},
			};
		}

		let history = await this.historyService.Post('/v3/History/Service', {
			method: 'FindByFields',
			src: {
				accountId: authInfo.accountId,
				'service.type': MiniProgramOrderConstant.SERVICE_TYPE.MINI_PROGRAM_ORDER_PAYMENT,
				'service.id': orderInfo.id,
			},
		});

		history = _.get(history, 'data.data.history');

		if (_.get(history, 'id', null) === null || _.get(history, 'state', '') !== FrontendConstant.HISTORY_STATE.PENDING) {
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
				state: FrontendConstant.HISTORY_STATE.PENDING,
				description: `Thanh toán Mini Program ${Numeral(orderInfo.amount).format('0,0')}VNĐ.`,
				changed: '-',
				tags: [],
			};
			history = await this.historyService.Post('/v3/History/Service', {
				method: 'CREATE',
				src: historyObj,
			});

			console.log('history', JSON.stringify(history));
			history = _.get(history, 'data.data.history');

			if (_.get(history, 'id', null) === null) {
				return {
					succeeded: false,
					data: {
						message: 'Tạo lệnh thanh toán Mini Program thất bại, vui lòng thử lại sau (E002)',
					},
				};
			}
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

		const paymentResponse = await this.broker.call('v1.Payment.Pay', paramsPayment);
		console.log('paymentResponse', paymentResponse);
		if (
			[
				PaymentConstant.STATE.FAILED,
				PaymentConstant.STATE.INVALID_PARAMS,
				PaymentConstant.STATE.BALANCE_NOT_ENOUGHT,
			].includes(paymentResponse.state)
		) {
			history = await this.historyService.Post('/v3/History/Service', {
				method: 'UPDATE',
				src: {
					accountId: authInfo.accountId,
					'service.transaction': transaction,
					'service.state': MiniProgramOrderConstant.STATE.PENDING,
				},
				dest: {
					'service.state': MiniProgramOrderConstant.STATE.FAILED,
					'service.data.state': MiniProgramOrderConstant.STATE.FAILED,
					state: FrontendConstant.HISTORY_STATE.FAILED,
					changed: null,
				},
			});
			history = _.get(history, 'data.data.history');
			return {
				code: 1001,
				data: {
					message: paymentResponse.message || 'Thanh toán Mini Program thất bại',
				},
			};
		}

		if (paymentResponse.state === PaymentConstant.STATE.SUCCEEDED) {
			orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOneAndUpdate', [{
				transaction,
				state: MiniProgramOrderConstant.STATE.PENDING,
			}, {
				state: MiniProgramOrderConstant.STATE.SUCCEEDED,
			}, { new: true }]);

			history = await this.historyService.Post('/v3/History/Service', {
				method: 'UPDATE',
				src: {
					'service.type': MiniProgramOrderConstant.SERVICE_TYPE.MINI_PROGRAM_ORDER_PAYMENT,
					'service.transaction': transaction,
					'service.state': MiniProgramOrderConstant.STATE.PENDING,
				},
				dest: {
					'service.state': MiniProgramOrderConstant.STATE.SUCCEEDED,
					'service.data.state': MiniProgramOrderConstant.STATE.SUCCEEDED,
					state: FrontendConstant.HISTORY_STATE.SUCCEEDED,
					balance: paymentResponse.balance,
					payment: paymentResponse.payment,
				},
			});
			console.log('history', history);
			history = _.get(history, 'data.data.history');

			const noti = await this.historyService.Post('/v3/Local/Notification', {
				accountId: orderInfo.accountId,
				message: `Bạn đã thanh toán thành công Mini Program số tiền ${Numeral(orderInfo.total).format('0,0')}đ.`,
				extraData: history,
				title: `${history.service.name}`,
			}, process.env.FE_ACCESSTOKEN);
			console.log('process.env.FE_ACCESSTOKEN', process.env.FE_ACCESSTOKEN);

			console.log('noti', noti);

			// const ipnState = await axios.post(orderInfo.ipnUrl, {
			// 	state: 'SUCCEEDED',
			// 	amount: orderInfo.amount,
			// 	transaction: orderInfo.partnerTransaction,
			// 	phone: authInfo.phone,
			// });

			// console.log('ipnState', ipnState);
			return {
				code: 1000,
				data: {
					message: 'Thanh toán thành công',
					orderInfo,
					redirectUrl: orderInfo.redirectUrl,
					failedUrl: orderInfo.failedUrl,
					historyId: history.id,
				},
			};
		}

		return {
			code: 1001,
			data: {
				message: paymentResponse.message,
				payment: paymentResponse,
				historyId: history.id,
			},
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Pay: ${err.message}`);
	}
};
