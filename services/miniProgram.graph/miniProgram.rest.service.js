module.exports = {
	name: 'MiniProgram.rest',

	version: 1,

	/**
	 * Settings
	 */
	settings: {
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
		 * Actions
		 */
	actions: {
		createOrder: {
			params: {
				input: 'object',
			},
			handler: require('./actions/createOrder.rest.action'),
		},
		getUserInformation: {
			params: {
				input: 'object',
			},
			handler: require('./actions/getUserInformation.rest.action'),
		},
		requestUserPermission: {
			params: {
				input: 'object',
			},
			handler: require('./actions/requestUserPermission.rest.action'),
		},
		createOrder: {
			rest: {
				method: 'POST',
				fullPath: '/eKYC/generateToken',
				//security: false,
				auth: {
					strategies: ['Default'],
					mode: 'try', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					userToken: 'string',
					partnerTransaction: 'string',
					amount: 'number',
					redirectUrl: 'string',
					failedUrl: 'string',
					description: 'string'
				},
			},
			handler: require('./actions/createOrder.rest.action'),
		},
		getUserInformation: {
			rest: {
				method: 'POST',
				fullPath: '/v1/MiniProgram/UserInformation',
				//security: false,
				auth: {
					strategies: ['Default'],
					mode: 'try', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					userToken: 'string'
				},
			},
			handler: require('./actions/getUserInformation.rest.action'),
		},
		requestUserPermission: {
			rest: {
				method: 'POST',
				fullPath: '/v1/MiniProgram/RequestPermission',
				//security: false,
				auth: {
					strategies: ['Default'],
					mode: 'try', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					userToken: 'string',
					scope: { type: "array", items: "string" }
				},
			},
			handler: require('./actions/requestUserPermission.rest.action'),
		},
	},

	/**
 * Events
 */
	events: {

	},

	/**
 * Methods
 */
	methods: {

	},

	/**
 * Service created lifecycle event handler
 */
	created() {

	},

	/**
 * Service started lifecycle event handler
 */
	async started() {

	},

	/**
 * Service stopped lifecycle event handler
 */
	async stopped() {

	},
};
