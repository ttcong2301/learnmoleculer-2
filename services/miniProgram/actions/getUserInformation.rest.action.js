const { MoleculerError } = require('moleculer').Errors;
const JsonWebToken = require('jsonwebtoken');
const _ = require('lodash');
const moment = require('moment');

const MiniProgramInfoConstant = require('../constants/MiniProgramInfoConstant');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const miniProgramInfo = ctx.meta.auth.credentials;

		const userTokenInfo = JsonWebToken.verify(payload.userToken, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);

		const now = new Date();
		if (moment(userTokenInfo.expiredAt).isAfter(now)) {
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
				message: 'Token không đúng',
			};
		}

		const userInfo = {};
		const accountInfo = await this.broker.call('v1.accountModel.findOne', [{ phone: userTokenInfo.phone }]);

		if (_.get(accountInfo, 'id', null) === null) {
			return {
				code: 1001,
				data: {
					message: 'Không tồn tại người dùng này',
				},
			};
		}
		if (_.includes(userTokenInfo.scope, MiniProgramUserTokenConstant.SCOPE.BASIC)) {
			userInfo.fullname = accountInfo.fullname;
			userInfo.email = accountInfo.isVerifiedEmail ? accountInfo.email : null;
		}
		if (_.includes(userTokenInfo.scope, MiniProgramUserTokenConstant.SCOPE.KYC)) {
			const kycInfo = await this.broker.call('v1.kycModel.findOne', [{ accountId: userTokenInfo.accountId }]);
			if (_.get(kycInfo, 'id', null) === null) {
				userInfo.kycState = null;
				userInfo.gender = null;
			} else {
				userInfo.kycState = kycInfo.state;
				userInfo.gender = kycInfo.gender;
			}
		}
		return {
			code: 1000,
			data: {
				message: 'Lấy thông tin thành công',
				userInfo,
			},
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Get User Infomation: ${err.message}`);
	}
};
