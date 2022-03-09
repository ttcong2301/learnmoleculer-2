const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	const infoToUpdate = ctx.params.body;
	const { credentials } = ctx.meta.auth;
	console.log("🚀 ~ credentials", credentials);


	const user = await ctx.call('UserModel.findOne', [{ email: credentials.email }]);

	if (!user) {
		throw new MoleculerClientError('User not found', 400);
	}

	return await ctx.call('UserModel.findOneAndUpdate', [{ email: credentials.email }, { $set: infoToUpdate }]);

}
