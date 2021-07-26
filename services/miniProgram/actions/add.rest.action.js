const _ = require('lodash');

const { MoleculerError } = require('moleculer').Errors;
const JsonWebToken = require('jsonwebtoken');
const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const obj = {
			miniProgramId: payload.miniProgramId,
			url: payload.url,
			ipnUrl: payload.ipnUrl,
			scope: payload.scope,
			state: MiniProgramConstant.STATE.ACTIVE,
			name: payload.name,
			logo: payload.logo,
		};
		let miniProgramCreate;
		miniProgramCreate = await this.broker.call('v1.miniProgramInfoModel.create', [obj]);

		if (_.get(miniProgramCreate, 'id', null) === null) {
			return {
				code: 1001,
				message: 'Thất bại',
			};
		}

		const miniProgramTokenInfo = {
			id: miniProgramCreate.id,
			scope: miniProgramCreate.scope,
			miniProgramId: miniProgramCreate.miniProgramId,
		};

		const miniProgramToken = JsonWebToken.sign(miniProgramTokenInfo, process.env.MINIPROGRAM_JWT_SECRETKEY);
		miniProgramCreate = await this.broker.call('v1.miniProgramInfoModel.findOneAndUpdate', [
			{
				id: miniProgramCreate.id,
			},
			{
				miniProgramToken,
			}]);

		if (_.get(miniProgramCreate, 'id', null) === null) {
			return {
				code: 1001,
				message: 'Thất bại',
			};
		}

		return {
			code: 1000,
			message: 'Thành công',
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Add: ${err.message}`);
	}
};
