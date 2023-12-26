class ProductsMemoryDAO {
	constructor() {
		this.products = []
		this.idLength = 1
	}

	getProducts() {
		return Promise.resolve(this.products)
	}

	getProductById(id) {
		return this.products.find(product => product.id === id) || null
	}

	addProduct(product) {
		product.id = this.idLength++
		this.products.push(product)
		return product
	}

	updateProduct(id, body) {
		const product = this.products.findIndex(product => product.id === id)
		this.products[product] = { ...body, id }
		return this.products[product]
	}

	async deleteProduct(id) {
		const product = this.products.findIndex(product => product.id === id)
		this.products.splice(product, 1)
	}
}

module.exports = ProductsMemoryDAO