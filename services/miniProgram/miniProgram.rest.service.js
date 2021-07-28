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
			rest: {
				method: 'POST',
				fullPath: '/v1/External/MiniProgram/CreateOrder',
				auth: {
					strategies: ['MiniProgram'],
					mode: 'required', // 'required', 'optional', 'try'
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
					ipnUrl: 'string',
					description: 'string',
				},
			},
			handler: require('./actions/createOrder.rest.action'),
		},
		getUserInformation: {
			rest: {
				method: 'POST',
				fullPath: '/v1/External/MiniProgram/UserInformation',
				auth: {
					strategies: ['MiniProgram'],
					mode: 'required', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					userToken: 'string',
				},
			},
			handler: require('./actions/getUserInformation.rest.action'),
		},
		add: {
			rest: {
				method: 'POST',
				fullPath: '/v1/Internal/MiniProgram/add',
				auth: {
					strategies: ['Default'],
					mode: 'try', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					miniProgramId: 'number',
					url: 'string',
					ipnUrl: 'string',
					scope: { type: 'array', items: 'string' },
					state: 'string',
					name: 'string',
					logo: 'string',
				},
			},
			handler: require('./actions/add.rest.action'),
		},
		edit: {
			rest: {
				method: 'PUT',
				fullPath: '/v1/Internal/MiniProgram/:miniProgramId',
				auth: {
					strategies: ['Default'],
					mode: 'try', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
				},
			},
			handler: require('./actions/edit.rest.action'),
		},
		search: {
			rest: {
				method: 'POST',
				fullPath: '/v1/Internal/MiniProgram/search',
				auth: {
					strategies: ['Local'],
					mode: 'try', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: 'object',
			},
			handler: require('./actions/search.rest.action'),
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
