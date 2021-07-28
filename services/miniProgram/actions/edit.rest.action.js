const _ = require('lodash');

const { MoleculerError } = require('moleculer').Errors;
const JsonWebToken = require('jsonwebtoken');
const MiniProgramConstant = require('../constants/MiniProgramInfoConstant');

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const { miniProgramId } = ctx.params.params;
		console.log('miniProgramId', miniProgramId);

		let miniProgramInfo = await this.broker.call('v1.MiniProgramInfoModel.findOne', [{
			miniProgramId,
		}]);

		if (_.get(miniProgramInfo, 'id', null) === null) {
			return {
				code: 1001,
				message: 'Không tồn tại Mini Program này',
			};
		}

		let miniProgramTokenInfo = null;

		if (payload.scope !== miniProgramInfo.scope) {
			miniProgramTokenInfo = {
				id: miniProgramInfo.id,
				scope: payload.scope || miniProgramTokenInfo,
				miniProgramId: miniProgramInfo.miniProgramId,
			};
		}

		const miniProgramToken = JsonWebToken.sign(miniProgramTokenInfo, process.env.MINIPROGRAM_JWT_SECRETKEY);

		miniProgramInfo = await this.broker.call('v1.MiniProgramInfoModel.findOneAndUpdate', [{
			id: miniProgramInfo.id,
		}, {
			url: payload.url || miniProgramInfo.url,
			ipnUrl: payload.ipnUrl || miniProgramInfo.ipnUrl,
			scope: payload.scope || miniProgramInfo.scope,
			state: payload.state || miniProgramInfo.state,
			name: payload.name || miniProgramInfo.name,
			logo: payload.logo || miniProgramInfo.logo,
			miniProgramToken: miniProgramTokenInfo !== null ? miniProgramToken : miniProgramInfo.miniProgramToken,
		}]);

		if (_.get(miniProgramInfo, 'id', null) === null) {
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
		throw new MoleculerError(`[MiniProgram] Edit: ${err.message}`);
	}
};
