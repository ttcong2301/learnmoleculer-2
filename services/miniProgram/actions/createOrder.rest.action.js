const { MoleculerError } = require('moleculer').Errors;
const JsonWebToken = require('jsonwebtoken');
const _ = require('lodash');
const { customAlphabet } = require('nanoid');
const { numbers } = require('nanoid-dictionary');

const MiniProgramInfoConstant = require('../constants/MiniProgramInfoConstant');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');
const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');

const nanoId = customAlphabet(numbers, 9);

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const { authInfo } = ctx.meta.auth.credentials;
		let userTokenInfo;
		let miniProgramInfo;
		try {
			userTokenInfo = JsonWebToken.verify(payload.userToken, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);
			miniProgramInfo = JsonWebToken.verify(authInfo, process.env.MINIPROGRAM_JWT_SECRETKEY);
		} catch (err) {
			throw new MoleculerError(`get User Infomation: ${err.message}`);
		}

		if (userTokenInfo.miniProgramId !== miniProgramInfo.miniProgramId) {
			return {
				code: 1001,
				message: 'Token không đúng',
			};
		}

		const accountInfo = await this.broker.call('v1.accountModel.findOne', [{ phone: userTokenInfo.phone }]);

		// const transaction = await this.broker.call('uuid.pick', { prefix: 'MiniProgramOrder', length: 9 });
		const transaction = nanoId();
		console.log('transaction', transaction);

		const orderObj = {
			accountId: accountInfo.id,
			miniProgramId: userTokenInfo.miniProgramId,
			transaction,
			partnerTransaction: payload.partnerTransaction,
			amount: payload.amount,
			fee: 0,
			total: payload.amount,
			redirectUrl: payload.redirectUrl,
			failedUrl: payload.failedUrl,
			ipnUrl: payload.ipnUrl,
			description: payload.description,
			state: MiniProgramOrderConstant.STATE.PENDING,
		};

		const orderCreate = await this.broker.call('v1.MiniProgramOrderModel.create', [orderObj]);

		if (_.get(orderCreate, 'id', null) === null) {
			return {
				code: 1001,
				message: 'Khởi tạo order thất bại',
			};
		}

		return {
			code: 1000,
			message: 'Thành công',
			transaction,
			paymentUrl: `${process.env.MINIPROGRAM_PAYMENT_URL}${transaction}`,
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Create Order: ${err.message}`);
	}
};
