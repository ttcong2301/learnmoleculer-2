const _ = require('lodash');

const MiniProgramInfoConstant = require('./constants/MiniProgramInfoConstant');

module.exports = {
	name: 'MiniProgram.graph',

	version: 1,

	mixins: [],

	/**
	 * Settings
	 */
	settings: {
		graphql: {
			type: require('./graph/type'),
			input: require('./graph/input'),
			enum: require('./graph/enum'),
			resolvers: {
				MiniProgramOps: {
					GetUserToken: {
						action: 'v1.MiniProgram.graph.getUserToken',
					},
					GetOrderInformation: {
						action: 'v1.MiniProgram.graph.getOrderInformation',
					},
					Pay: {
						action: 'v1.MiniProgram.graph.pay',
					},
					RequestPermission: {
						action: 'v1.MiniProgram.graph.requestPermission',
					},
					GetList: {
						action: 'v1.MiniProgram.graph.getList',
					},
				},
			},
		},
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
		 * Actions
		 */
	actions: {
		requestPermission: {
			params: {
				input: {
					$$type: 'object',
					userToken: 'string',
					securityCode: 'string',
				},
			},
			handler: require('./actions/requestUserPermission.graph.action'),
		},
		getUserToken: {
			params: {
				input: {
					$$type: 'object',
					miniProgramId: 'number',
				},
			},
			handler: require('./actions/getUserToken.graph.action'),
		},
		getOrderInformation: {
			params: {
				input: {
					$$type: 'object',
					transaction: 'string',
				},
			},
			handler: require('./actions/getOrderInformation.graph.action'),
		},
		pay: {
			params: {
				input: {
					$$type: 'object',
					transaction: 'string',
					payment: 'object',
					clientId: 'string',
				},
			},
			handler: require('./actions/pay.graph.action'),
		},
		getList: {
			params: {
				input: {
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
			handler: require('./actions/getList.graph.action'),
		},
		MiniProgramOps: {
			graphql: {
				mutation: 'MiniProgram: MiniProgramOps',
			},
			handler(ctx) {
				return true;
			},
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
