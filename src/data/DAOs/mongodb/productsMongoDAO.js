const productModel = require('../models/productModel')

class ProductsMongoDAO {
	constructor() {
		this.model = productModel
	}
	async getProducts() {
		return await this.model.find()
	}

	async getProductById(id) {
		try {
			const product = await this.model.findById(pid)
			if (product) {
				return product.toObject()
			}
		} catch (error) {
			throw error
		}
	}

	async addProduct(product) {
		return await this.model.create(product)
	}

	async updateProduct(id, body) {
		try {
			const findProduct = this.model.findByIdAndUpdate(id, { $set: body })

			return findProduct
		} catch (error) {
			throw error
		}
	}

	async deleteProduct(id) {
		try {
			return await this.model.findByIdAndDelete(id)
		} catch (error) {
			throw error
		}
	}

}

module.exports = ProductsMongoDAO