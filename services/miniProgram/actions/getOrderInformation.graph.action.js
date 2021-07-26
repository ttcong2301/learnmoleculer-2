const { MoleculerError } = require('moleculer').Errors;
const _ = require('lodash');

const MiniProgramInfoConstant = require('../constants/MiniProgramInfoConstant');
const MiniProgramUserTokenConstant = require('../constants/MiniProgramUserTokenConstant');
const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.input;
		const authInfo = ctx.meta.auth.credentials;

		const obj = {
			accountId: authInfo.accountId,
			transaction: payload.transaction,
			state: MiniProgramOrderConstant.STATE.PENDING,
		};

		console.log('obj', obj);
		const orderInfo = await this.broker.call('v1.MiniProgramOrderModel.findOne', [{
			accountId: authInfo.accountId,
			transaction: payload.transaction,
			state: MiniProgramOrderConstant.STATE.PENDING,
		}]);

		console.log('orderInfo', orderInfo);

		if (_.get(orderInfo, 'id', null) === null) {
			return {
				message: 'không tìm thấy order này',
				succeeded: false,
			};
		}
		return {
			message: 'Lấy thông tin order thành công',
			succeeded: true,
			orderInfo,
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Get Order Information: ${err.message}`);
	}
};
