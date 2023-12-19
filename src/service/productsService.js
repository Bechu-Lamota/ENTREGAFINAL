const ProductsRepository = require('../repository/productsRepository')
const { sendMail } = require('../config/nodemailer')

class ProductService {
	constructor() {
		this.repository = new ProductsRepository()
	}

	async getProducts() {
		const products = await this.repository.getProducts()
		return products
	}

	async getProductById(id) {
		return this.repository.findById(id)
	}

	async addProduct(body, user) {
		// Verifica si el usuario tiene el rol adecuado o es el propietario
		if (!(user && (user.role === 'ADMIN' || user.email === body.owner))) {
			throw new Error('No tienes permisos para agregar este producto')
		}
		return this.repository.create({
			code: body.code,
			stock: body.stock,
			title: body.title,
			price: body.price,
			owner: body.owner || (user ? user.email : null), // Asigna el propietario solo si hay un usuario autenticado
		}).then(product => {
			console.log({ product })
			sendMail('Nuevo producto agregado', JSON.stringify(product))
			return product
		})
	}

	async updateProduct(id, body, user) {
		const product = await this.getProductById(id)

		if (!product) {
			throw new Error('Producto no existe')
		}

		// Verifica si el usuario tiene permisos para actualizar el producto
		if (
			!(user && (user.role === 'ADMIN' || user.email === product.owner))
		) {
			throw new Error('No tienes permisos para actualizar este producto')
		}

		const productUpdated = {
			_id: product._id,
			code: body.code || product.code,
			stock: body.stock || product.stock,
			title: body.title || product.title,
			price: body.price || product.price,
		}

		await this.repository.updateOne({ _id: id }, productUpdated)

		return productUpdated
	}

	async deleteProduct(id, user) {
		const product = await this.repository.findById(id)

		if (!product) {
			throw new Error('Producto no existe')
		}

		// Verifica si el usuario tiene permisos para eliminar el producto
		if (
			!(user && (user.role === 'ADMIN' || (user.role === 'PREMIUM' && product.owner === user.email)))
		) {
			throw new Error('No tienes permisos para eliminar este producto')
		}

		await this.repository.deleteOne({ _id: id })

		return true
	}

}

module.exports = ProductService