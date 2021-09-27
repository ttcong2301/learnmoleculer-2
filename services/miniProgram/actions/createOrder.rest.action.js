const { MoleculerError } = require('moleculer').Errors;
const JsonWebToken = require('jsonwebtoken');
const _ = require('lodash');
const { customAlphabet } = require('nanoid');
const { numbers } = require('nanoid-dictionary');
const moment = require('moment');

const MiniProgramInfoConstant = require('../constants/MiniProgramInfoConstant');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');
const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');

const nanoId = customAlphabet(numbers, 9);

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const miniProgramInfo = ctx.meta.auth.credentials;
		let userTokenInfo;
		try {
			userTokenInfo = JsonWebToken.verify(payload.userToken, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);
		} catch (err) {
			throw new MoleculerError(`get User Infomation: ${err.message}`);
		}

		const now = new Date();
		console.log(userTokenInfo);
		console.log('now', now);
		if (moment(now).isAfter(userTokenInfo.expiredAt)) {
			return {
				code: 1001,
				data: {
					message: 'Token đã hết hạn',
				},
			};
		}

		if (userTokenInfo.miniProgramId !== miniProgramInfo.miniProgramId) {
			return {
				code: 1001,
				data: {
					message: 'Token không đúng',
				},
			};
		}

		const accountInfo = await this.broker.call('v1.accountModel.findOne', [{ phone: userTokenInfo.phone }]);

		userTokenInfo = await this.broker.call('v1.MiniProgramUserTokenModel.findOne', [{ accountId: accountInfo.id }]);

		if (_.get(userTokenInfo, 'state', null) !== MiniProgramUserTokenConstant.STATE.ACTIVE) {
			return {
				code: 1001,
				data: {
					message: 'Token không đúng',
				},
			};
		}

		const transaction = await this.broker.call('uuid.pick', {
			prefix: 'MINI_PROGRAM_ORDER',
		});
		// const transaction = await this.broker.call('uuid.pick', { prefix: 'MiniProgramOrder', length: 9 });
		// const transaction = nanoId();

		let orderCreate = await this.broker.call('v1.MiniProgramOrderModel.findOne', [{ transaction }]);

		if (_.get(orderCreate, 'id', null) !== null) {
			return {
				code: 1001,
				data: {
					message: 'Khởi tạo order thất bại',
				},
			};
		}

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

		orderCreate = await this.broker.call('v1.MiniProgramOrderModel.create', [orderObj]);

		if (_.get(orderCreate, 'id', null) === null) {
			return {
				code: 1001,
				data: {
					message: 'Khởi tạo order thất bại',
				},
			};
		}

		return {
			code: 1000,
			data: {
				message: 'Thành công',
				transaction,
				paymentUrl: `${process.env.MINIPROGRAM_PAYMENT_URL}${transaction}`,
			},
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Create Order: ${err.message}`);
	}
};
