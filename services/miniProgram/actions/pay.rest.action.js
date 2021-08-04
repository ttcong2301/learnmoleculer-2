const { MoleculerError } = require('moleculer').Errors;
const _ = require('lodash');
const axios = require('axios');

const MiniProgramInfoConstant = require('../constants/MiniProgramInfoConstant');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');
const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');

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
				message: 'Không tìm thấy order',
			};
		}

		const params = {
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

		orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOneAndUpdate', [{
			transaction,
			state: MiniProgramOrderConstant.STATE.PENDING,
		}, {
			state: MiniProgramOrderConstant.STATE.SUCCEEDED,
			payment: {
				id: 1,
				transaction,
				method: 'WALLET',
				state: 'SUCCEEDED',
				description: 'Thanh toán bằng ví PayME',
			},
		}, { new: true }]);

		const ipnState = await axios.post(orderInfo.ipnUrl, {
			state: 'SUCCEEDED',
			amount: orderInfo.amount,
			transaction: orderInfo.partnerTransaction,
			phone: authInfo.phone,
		});

		console.log('ipnState', ipnState);

		return {
			code: 1000,
			message: 'Thanh toán thành công',
			orderInfo,
			redirectUrl: orderInfo.redirectUrl,
			failedUrl: orderInfo.failedUrl,
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
