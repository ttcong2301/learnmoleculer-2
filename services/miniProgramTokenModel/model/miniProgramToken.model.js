const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const { customAlphabet } = require('nanoid');
const { alphanumeric } = require('nanoid-dictionary');
const _ = require('lodash');
const MiniProgramTokenConstant = require('../constants/MiniProgramTokenConstant');

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
	scope: [
		{
			type: String,
			enum: _.values(MiniProgramTokenConstant.SCOPE),
		},
	],
	state: {
		type: String,
		require: true,
		enum: _.values(MiniProgramTokenConstant.STATE),
	},
	name: {
		type: String,
		require: true,
	},
}, {
	collection: 'Service_MiniProgramToken',
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
