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

		const where = {};
		if (_.get(payload, 'id', null) !== null) where.id = payload.id;
		if (_.get(payload, 'miniProgramId', null) !== null) where.miniProgramId = payload.miniProgramId;
		if (_.get(payload, 'state', null) !== null) {
			where.state = _.isArray(payload.state) ? { $in: payload.state } : payload.state;
		} else where.state = MiniProgramInfoConstant.STATE.ACTIVE;
		const miniProgramList = await this.broker.call('v1.MiniProgramInfoModel.findMany', [where, 'id miniProgramId state name logo url']);
		console.log('miniProgramList', miniProgramList);
		if (!_.isNil(miniProgramList) && _.get(miniProgramList[0], 'id', null) !== null) {
			// const miniProgram = [];
			// miniProgramList.forEach(element => {
			// 	_.pick(element, 'id')
			// });
			return {
				code: 1000,
				data: {
					message: 'Lấy danh sách Mini Program thành công',
					data: miniProgramList,
				},
			};
		}
		return {
			code: 1001,
			data: {
				message: 'Lấy danh sách Mini Program thất bại',
			},
		};
	} catch (err) {
		if (err.name === 'MoleculerError') throw err;
		throw new MoleculerError(`[MiniProgram] Get List: ${err.message}`);
	}
};
