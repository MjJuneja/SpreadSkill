'use strict';
//Schema for app session database

const mongoose = require("./connection");
const config = require("./config");
const schema = mongoose.Schema;

const bookSchema = mongoose.Schema({
	title:{
		type: String,
		required: true
	},
	genre:{
		type: String,
		required: true
	},
	description:{
		type: String
	},
	author:{
		type: String,
		required: true
	},
	publisher:{
		type: String
	},
	pages:{
		type: String
	},
	image_url:{
		type: String
	},
	buy_url:{
		type: String
	},
	create_date:{
		type: Date,
		default: Date.now
	}
});


module.exports = mongoose.model('Book', bookSchema);
