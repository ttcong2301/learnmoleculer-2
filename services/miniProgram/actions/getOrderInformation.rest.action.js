const { MoleculerError } = require('moleculer').Errors;
const _ = require('lodash');

const MiniProgramInfoConstant = require('../constants/MiniProgramInfoConstant');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');
const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		let authInfo = ctx.meta.auth.credentials;

		authInfo = await this.broker.call('auth.default', authInfo);

		const orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOne', [{
			accountId: authInfo.accountId,
			transaction: payload.transaction,
			state: MiniProgramOrderConstant.STATE.PENDING,
		}]);

		if (_.get(orderInfo, 'id', null) === null) {
			return {
				message: 'không tìm thấy order này',
				code: 1001,
			};
		}
		return {
			message: 'Lấy thông tin order thành công',
			code: 1000,
			orderInfo,
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Get Order Information: ${err.message}`);
	}
};
