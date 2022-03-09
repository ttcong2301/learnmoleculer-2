const _ = require('lodash');
const MeAPI = require('../../serviceDependencies/MEAPI');
const { sign } = require('jsonwebtoken');

module.exports = {
	name: 'userInfo.rest',

	/**
	 * Settings
	 */
	settings: {
		JWT_SECRET: process.env.JWT_SECRET || 'secret',
	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
		 * Actions
		 */
	actions: {
		getUserInfo: {
			rest: {
				method: 'GET',
				fullPath: '/user/getUserInfo/:email',
				auth: false,
			},
			handler: require('./actions/getUserInfo.action'),
		},
		updateUserInfo: {
			rest: {
				method: 'POST',
				fullPath: '/user/updateUserInfo/',
				auth: {
					strategies: ['jwt'],
					mode: 'required',
				},
				params: {
					body: {
						$$type: 'object',
						password: 'string|required|min:6',
						fullName: 'string|required',
						phone: 'string|required',
						gender: {
							type: 'string',
							enum: ['male', 'female'],
							required: true
						},
						avatar: 'string|optional'
					}
				}
			},
			handler: require('./actions/updateUserInfo.action'),
		}

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
		generateJWT(payload) {
			return sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
		}
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
		const url = process.env.FE_URL;
		const isSecurity = process.env.FE_SECURITY === 'true';
		const privateKey = process.env.FE_PRIVATEKEY;
		const publicKey = process.env.FE_PUBLICKEY;

		this.historyService = new MeAPI({
			url, publicKey, privateKey, isSecurity, 'x-api-client': 'app',
		});
	},

	/**
* Service stopped lifecycle event handler
*/
	async stopped() {
	},
};
