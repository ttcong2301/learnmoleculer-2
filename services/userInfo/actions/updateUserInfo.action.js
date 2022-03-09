const _ = require('lodash');
const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	const infoToUpdate = ctx.params.body;
	const { credentials } = ctx.meta.auth;
	console.log("🚀 ~ credentials", credentials);


	const user = await ctx.call('UserModel.findOne', [{ email: credentials.email }]);

	if (!user) {
		throw new MoleculerClientError('User not found', 400);
	}
	const updatedUser = await ctx.call('UserModel.findOneAndUpdate', [{ email: credentials.email }, { $set: infoToUpdate }]);

	return _.omit(updatedUser, ['password']);

}
