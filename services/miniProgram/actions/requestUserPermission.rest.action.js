const _ = require('lodash');
const JsonWebToken = require('jsonwebtoken');
const { MoleculerError } = require('moleculer').Errors;

const MiniProgramInfoConstant = require('../constants/MiniProgramInfoConstant');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		let authInfo = ctx.meta.auth.credentials;

		authInfo = await this.broker.call('auth.default', authInfo);

		// if (_.get(payload, 'securityCode', null) === null) {
		// 	return {
		// 		message: 'Thông tin xác thực thanh toán không chính xác',
		// 		succeeded: false,
		// 		state: 'REQUIRE_VERIFY',
		// 	};
		// }

		// let securityCodeInfo = await AccountService.LocalSecurityCodeSearch({
		// 	accountId: authInfo.accountId,
		// 	code: payload.securityCode,
		// });
		// if (_.get(securityCodeInfo, 'code', false) === false) {
		// 	return {
		// 		message: 'Thông tin xác thực thanh toán không chính xác',
		// 		succeeded: false,
		// 		state: 'REQUIRE_VERIFY',
		// 	};
		// }
		// securityCodeInfo = securityCodeInfo.data[0];
		// if (_.get(securityCodeInfo, 'id', false) === false) {
		// 	return {
		// 		message: 'Thông tin xác thực thanh toán không chính xác!',
		// 		succeeded: false,
		// 		state: 'REQUIRE_VERIFY',
		// 	};
		// }
		// await AccountService.LocalSecurityCodeDelete(securityCodeInfo.id);

		const userToken = JsonWebToken.verify(payload.userToken, process.env.MINIPROGRAM_USER_JWT_SECRETKEY);

		const userTokenInfo = await this.broker.call('v1.MiniProgramUserTokenModel.findOneAndUpdate', [{
			accountId: authInfo.accountId,
			miniProgramId: userToken.miniProgramId,
			state: MiniProgramUserTokenConstant.STATE.REQUIRE_PERMISSION,
		}, {
			state: MiniProgramUserTokenConstant.STATE.ACTIVE,
		}]);
		return {
			code: 1001,
			message: 'Cập nhật quyền thành công',
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Request User Permission: ${err.message}`);
	}
};
