const { MoleculerClientError } = require('moleculer').Errors;

module.exports = async function (ctx) {
	const { email } = ctx.params.params;

	const user = await ctx.call('UserModel.findOne', [{ email }, { password: 0 }]);

	if (!user) {
		throw new MoleculerClientError("User not found", 400);
	}

	return user;
}

