const _ = require('lodash');
const moment = require('moment');
const JsonWebToken = require('jsonwebtoken');
const { MoleculerError } = require('moleculer').Errors;

const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');
const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.input;
		let authInfo = ctx.meta.auth.credentials;
		const { miniProgramId } = payload;
		authInfo = await this.broker.call('auth.default', authInfo);

		const miniProgramInfo = await this.broker.call('v1.MiniProgramInfoModel.findOne', [{ miniProgramId, state: MiniProgramConstant.STATE.ACTIVE }]);

		if (_.get(miniProgramInfo, 'id', null) === null) {
			return {
				message: 'Không tìm thấy thông tin Mini Program',
				succeeded: false,
			};
		}

		let userTokenInfo = await this.broker.call('v1.MiniProgramUserTokenModel.findOne', [{
			accountId: authInfo.accountId,
			miniProgramId: payload.miniProgramId,
		}]);

		let userToken;
		if (_.get(userTokenInfo, 'id', null) !== null) {
			userTokenInfo.scope = userTokenInfo.scope.sort();
			miniProgramInfo.scope = miniProgramInfo.scope.sort();
			console.log('userTokenInfo.scope !== miniProgramInfo.scope', userTokenInfo.scope, miniProgramInfo.scope);
			let state;
			if (state === MiniProgramUserTokenConstant.STATE.REQUIRE_PERMISSION || userTokenInfo.scope.toString() !== miniProgramInfo.scope.toString()) {
				state = MiniProgramUserTokenConstant.STATE.REQUIRE_PERMISSION;
			} else state = MiniProgramUserTokenConstant.STATE.ACTIVE;
			userTokenInfo = await this.broker.call('v1.MiniProgramUserTokenModel.findOneAndUpdate', [{
				miniProgramId,
				accountId: authInfo.accountId,
			}, {
				expiredAt: moment(new Date()).add(1, 'hour'),
				scope: miniProgramInfo.scope,
				state,
			}, { new: true }]);
			console.log('userTokenInfo', userTokenInfo);

			const obj = {
				phone: authInfo.phone,
				scope: userTokenInfo.scope,
				miniProgramId,
				expiredAt: moment(new Date()).add(1, 'hour'),
			};
			userToken = JsonWebToken.sign(obj, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);

			if (state === MiniProgramUserTokenConstant.STATE.REQUIRE_PERMISSION) {
				return {
					succeeded: false,
					message: 'Yêu cầu cấp quyền từ người dùng',
					userToken,
					state,
				};
			}

			return {
				succeeded: true,
				message: 'Lấy UserToken thành công',
				userToken,
				state,
			};
		}

		const userTokenInfoObj = {
			miniProgramId,
			accountId: authInfo.accountId,
			expiredAt: moment(new Date()).add(1, 'hour'),
			platform: payload.platform,
			scope: miniProgramInfo.scope,
			state: MiniProgramUserTokenConstant.STATE.REQUIRE_PERMISSION,
		};

		userTokenInfo = await this.broker.call('v1.MiniProgramUserTokenModel.create', [userTokenInfoObj]);
		const obj = {
			phone: authInfo.phone,
			scope: userTokenInfo.scope,
			miniProgramId,
			expiredAt: moment(new Date()).add(1, 'hour'),
		};
		userToken = JsonWebToken.sign(obj, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);
		return {
			succeeded: false,
			message: 'Yêu cầu cấp quyền từ người dùng',
			userToken,
			state: MiniProgramUserTokenConstant.STATE.REQUIRE_PERMISSION,
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Get UserToken: ${err.message}`);
	}
};
