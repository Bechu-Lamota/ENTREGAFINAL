const mongoose = require('mongoose')
const { Schema } = require('./cartModel')

const userSchema = new mongoose.Schema({
	name: String,
	lastname: String,
	age: Number,
	email: {
		type: String,
		unique: true,

	},
	phone: {
		type: Number,
		unique: true
	},
	password: String,
	role: {
		type: String,
		enum: ['USER', 'ADMIN', 'PREMIUM'],
		default: 'USER'
	},
	createdAt: {
		type: Date,
		default: Date.now()
	},
	cart: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'carts'
	},
	documents: {
		type: [
			{
				name: {
					type: String,
					required: true
				},
				reference: {
					type: String,
					required: true
				}
			}
		],
		default: []
	},
	documentUploadStatus: {
		type: Boolean,
		default: false
	},
	last_connection: {
		type: Date,
	}
})
module.exports = mongoose.model('users', userSchema)