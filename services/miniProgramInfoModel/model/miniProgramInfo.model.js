const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { customAlphabet } = require('nanoid');
const { alphanumeric } = require('nanoid-dictionary');
const _ = require('lodash');
const miniProgramInfoConstant = require('../constants/miniProgramInfoConstant');

const nanoId = customAlphabet(alphanumeric, 15);

autoIncrement.initialize(mongoose);

const Schema = mongoose.Schema({
	id: {
		type: Number,
		required: true,
		unique: true,
	},
	miniProgramId: {
		type: Number,
		require: true,
		unique: true,
	},
	miniProgramToken: {
		type: String,
		require: true,
		unique: true,
	},
	url: {
		type: String,
		require: true,
	},
	ipnUrl: {
		type: String,
		require: true,
	},
	secretKey: {
		type: String,
		default: null,
	},
	scope: [
		{
			type: String,
			enum: _.values(miniProgramInfoConstant.SCOPE),
		},
	],
	state: {
		type: String,
		require: true,
		enum: _.values(miniProgramInfoConstant.STATE),
	},
	name: {
		type: String,
		require: true,
	},
	logo: {
		type: String,
		require: true,
	},
}, {
	collection: 'Service_miniProgramInfo',
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
