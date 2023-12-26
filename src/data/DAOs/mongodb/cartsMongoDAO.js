const cartModel = require('../models/cartModel')
const ticketsMongoDAO = require('./ticketsMongoDAO')
const ticketManager = new ticketsMongoDAO()

class CartMongoDAO {
	constructor() {
		this.cart = cartModel
	}

	async getCarts() {//busca todos los carritos que hayan
		try {
			const carts = await this.cart.find()
			return carts
		} catch (error) {
			throw error
		}
	}

	async getCartById(id) { //lo busca según el id proporcionado
		try {
			const cart = await this.cart.findById(id)
			return cart
		} catch (error) {
			throw error
		}
	}

	async addCart() { //Crea el carrito
		try {
			const cart = await this.cart.create({ products: [] })
			return cart
		} catch (error) {
			throw error
		}
	}

	async addProductCart(id, pid, quantity) { //Agregamos un producto al carrito
		try {
			const cart = await this.getCartById(id)

			if (!cart) {
				throw new Error('El carrito no existe');
			}

			const existingProduct = cart.products.find(product => product.pid.equals(pid));

			if (existingProduct) {
				existingProduct.quantity += quantity || 1;
			} else {
				cart.products.push({
					pid,
					quantity: quantity || 1,
				});
			}

			await cart.save();
			return cart;
		} catch (error) {
			throw error;
		}
	}

	async updateCart(id, body) { //Debe actualizar el carrito
		try {
			const updatedCart = await this.getCartById(id)

			if (!updatedCart) {
				throw new Error('El carrito no existe');
			}

			updateCart.name = body.name || updatedCart.name
			updateCart.products = body.products || updatedCart.products

			await updatedCart.save()
			return updateCart
		} catch (error) {
			throw error
		}
	}

	async updateCartProduct(id) { //Debe actualizar un producto del carrito
		try {
			const cart = await this.getCartById(id)

			if (!cart) {
				throw new Error("El carrito existe")
			}

			const updateCartProduct = {
				name: cart.name,
				products: [{
					productId: cart.products[0].pid,
					quantity: cart.products.quantity
				}]
			}

			await this.cart.updateOne({ _id: id }, updateCartProduct)
			return updateCartProduct
		} catch (error) {
			throw error
		}
	}

	async updateCartProducts(id, body) { //Debe actualizar varios productos del carrito.
		try {
			const cart = await this.getCartById(id)

			if (!cart) {
				throw new Error("El carrito existe")
			}

			await this.cart.updateOne(
				{ _id: id },
				{ $set: { products: body } }
			)

		} catch (error) {
			throw error
		}
	}

	async deleteCart(id) { //Debe elimar el carrito, sin importar que contenga.
		try {
			const cart = await this.getCartById(id)

			if (!cart) {
				throw new Error("El carrito existe")
			}

			return this.cart.deleteOne({ _id: id })
		} catch (error) {
			throw error
		}
	}

	async deleteCartProduct(id, pid) { //Debe eliminar un producto del carrito
		try {
			const cart = await this.getCartById(id)

			if (!cart) {
				throw new Error("El carrito existe")
			}
			cart.products = cart.products.filter(product => !product.pid.equals(pid))
			await cart.save()

			return cart
		} catch (error) {
			throw error
		}
	}

	async deleteCartProducts(id) { //Debe eliminar los productos del carrito dejandolo [], pero no eliminando el carrito.
		try {
			const cart = await this.getCartById(id)

			if (cart) {
				cart.products = []
				await cart.save()

				return cart
			} else {
				throw new Error('Carrito no encontrado')
			}
		} catch (error) {
			throw error
		}
	}

	async purchaseCart(data) {
		try {
			const purchase = await ticketManager.addTicket({
				amount: data.amount,
				purchaser: data.purchaser
			})
			return purchase

		} catch (error) {
			throw error
		}
	}

}

module.exports = CartMongoDAO