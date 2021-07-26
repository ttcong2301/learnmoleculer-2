const _ = require('lodash');

const { MoleculerError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	try {
		const payload = ctx.params.body;
		const { filter } = payload;

		const miniProgramInfos = await this.broker.call('v1.miniProgramInfoModel.findMany', [filter]);

		if (!_.isNil(miniProgramInfos) && _.get(miniProgramInfos[0], 'id', null) !== null) {
			return {
				code: 1000,
				message: 'Thành công',
				items: miniProgramInfos,
			};
		}
		return {
			code: 1001,
			message: 'Thất bại',
			items: [],
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Search: ${err.message}`);
	}
};
