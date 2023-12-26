const mongoose = require('mongoose')
const paginate = require('mongoose-paginate-v2')

const productSchema = mongoose.Schema({
	title: String,
	description: String,
	price: Number,
	code: {
		type: String,
		unique: true
	},
	status: Boolean,
	category: String,
	thumbnail: String,
	stock: Number,
	owner: {
		type: String,
		default: 'ADMIN'
	}
})

productSchema.plugin(paginate)

module.exports = mongoose.model('products', productSchema)