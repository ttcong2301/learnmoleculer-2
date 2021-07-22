const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { customAlphabet } = require('nanoid');
const { alphanumeric } = require('nanoid-dictionary');

const _ = require('lodash');
const MiniProgramOrderConstant = require('../constants/MiniProgramOrderConstant');

const nanoId = customAlphabet(alphanumeric, 15);

autoIncrement.initialize(mongoose);

const Schema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	accountId: {
		type: Number,
		require: true,
	},
	miniProgramId: {
		type: Number,
		require: true,
	},
	transaction: {
		type: String,
		require: true,
		unique: true,
	},
	partnerTransaction: {
		type: String,
		require: true,
	},
	amount: {
		type: Number,
		require: true,
		default: null,
	},
	fee: {
		type: Number,
		require: true,
		default: null,
	},
	total: {
		type: Number,
		require: true,
		default: null,
	},
	redirectUrl: {
		type: String,
		default: null,
	},
	failedUrl: {
		type: String,
		default: null,
	},
	ipnUrl: {
		type: String,
		default: null,
	},
	description: {
		type: String,
		require: true,
		default: null,
	},
	state: {
		type: String,
		enum: _.values(MiniProgramOrderConstant.STATE),
	},
	payment: {
		id: { type: Number },
		transaction: { type: String },
		method: { type: String },
		state: { type: String },
		description: { type: String },
	},
	extraData: Object,
}, {
	collection: 'Service_MiniProgramOrder',
	versionKey: false,
	timestamps: true,
});

/*
| ==========================================================
| Plugins
| ==========================================================
*/

Schema.plugin(autoIncrement.plugin, {
	model: `${Schema.options.collection}-id`,
	field: 'id',
	startAt: 1,
	incrementBy: 1,
});

/*
| ==========================================================
| Methods
| ==========================================================
*/

/*
| ==========================================================
| HOOKS
| ==========================================================
*/

module.exports = mongoose.model(Schema.options.collection, Schema);
