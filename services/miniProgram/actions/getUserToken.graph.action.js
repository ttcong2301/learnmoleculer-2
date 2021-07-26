const _ = require('lodash');
const moment = require('moment');
const JsonWebToken = require('jsonwebtoken');
const { MoleculerError } = require('moleculer').Errors;

const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');
const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.input;
		const authInfo = ctx.meta.auth.credentials;
		const { miniProgramId } = payload;
		console.log('payload', payload);
		console.log('authInfo', authInfo);

		let userTokenInfo = await this.broker.call('v1.MiniProgramUserTokenModel.findOne', [{
			accountId: authInfo.accountId,
			miniProgramId: payload.miniProgramId,
			state: MiniProgramUserTokenConstant.STATE.ACTIVE,
		}]);

		console.log('userTokenInfo', userTokenInfo);

		const accountInfo = await this.broker.call('v1.accountModel.findOne', [{ id: authInfo.accountId }]);

		let userToken;
		if (_.get(userTokenInfo, 'id', null) !== null) {
			const obj = {
				phone: accountInfo.phone,
				scope: userTokenInfo.scope,
				miniProgramId,
			};
			userToken = JsonWebToken.sign(obj, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);
			return {
				succeeded: true,
				message: 'Lấy UserToken thành công',
				userToken,
			};
		}

		const miniProgramInfo = await this.broker.call('v1.MiniProgramInfoModel.findOne', [{ miniProgramId, state: MiniProgramConstant.STATE.ACTIVE }]);

		if (_.get(miniProgramInfo, 'id', null) === null) {
			return {
				message: 'Không tìm thấy thông tin Mini Program',
				succeeded: false,
			};
		}
		const userTokenInfoObj = {
			miniProgramId,
			accountId: authInfo.accountId,
			expiredAt: moment(new Date()).add(1, 'hour'),
			platform: payload.platform,
			scope: miniProgramInfo.scope,
			state: MiniProgramUserTokenConstant.STATE.ACTIVE,
		};

		userTokenInfo = await this.broker.call('v1.MiniProgramUserTokenModel.create', [userTokenInfoObj]);
		const obj = {
			phone: accountInfo.phone,
			scope: userTokenInfo.scope,
			miniProgramId,
		};
		userToken = JsonWebToken.sign(obj, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);
		return {
			succeeded: true,
			message: 'Lấy UserToken thành công',
			userToken,
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Get UserToken: ${err.message}`);
	}
};
