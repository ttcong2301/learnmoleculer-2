const _ = require('lodash');

const MiniProgramInfoConstant = require('./constants/MiniProgramInfoConstant');

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
		requestPermission: {
			rest: {
				method: 'POST',
				fullPath: '/v1/External/MiniProgram/RequestPermission',
				auth: {
					strategies: ['Default'],
					mode: 'required', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					userToken: 'string',
					securityCode: 'string',
				},
			},
			handler: require('./actions/requestUserPermission.rest.action'),
		},
		getUserToken: {
			rest: {
				method: 'POST',
				fullPath: '/v1/External/MiniProgram/GetUserToken',
				auth: {
					strategies: ['Default'],
					mode: 'required', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					miniProgramId: 'number',
				},
			},
			handler: require('./actions/getUserToken.rest.action'),
		},
		getOrderInformation: {
			rest: {
				method: 'POST',
				fullPath: '/v1/External/MiniProgram/GetOrderInformation',
				auth: {
					strategies: ['Default'],
					mode: 'required', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					transaction: 'string',
				},
			},
			handler: require('./actions/getOrderInformation.rest.action'),
		},
		pay: {
			rest: {
				method: 'POST',
				fullPath: '/v1/External/MiniProgram/Pay',
				auth: {
					strategies: ['Default'],
					mode: 'required', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					transaction: 'string',
					payment: 'object',
					clientId: 'string',
				},
			},
			handler: require('./actions/pay.rest.action'),
		},
		getList: {
			rest: {
				method: 'POST',
				fullPath: '/v1/External/MiniProgram/GetList',
				auth: {
					strategies: ['Default'],
					mode: 'required', // 'required', 'optional', 'try'
				},
			},
			params: {
				body: {
					$$type: 'object',
					id: {
						type: 'number',
						optional: true,
					},
					miniProgramId: {
						type: 'number',
						optional: true,
					},
					state: {
						type: 'array',
						optional: true,
						items: {
							type: 'string',
							enum: _.values(MiniProgramInfoConstant.STATE),
						},
					},
				},
			},
			handler: require('./actions/getList.rest.action'),
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
