const mongoose = require('mongoose');
const DbService = require('moleculer-db');
const MongooseAdapter = require('moleculer-db-adapter-mongoose');
const MongooseAction = require('moleculer-db-adapter-mongoose-action');
const MiniProgramUserTokenModel = require('./model/miniProgramUserToken.model');

module.exports = {
	name: 'MiniProgramUserTokenModel',

	version: 1,

	mixins: [DbService],

	adapter: new MongooseAdapter(process.env.MONGO_URI_FE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		keepAlive: true,
	}),

	model: MiniProgramUserTokenModel,

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
	actions: MongooseAction(),

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() { },

	/**
	 * Service stopped lifecycle event handler
	 */

	// async stopped() {},

	async afterConnected() {
		this.logger.info('Connected successfully...');
	},
};
