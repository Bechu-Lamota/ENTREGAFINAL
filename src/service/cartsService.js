const CartsRepository = require('../repository/cartsRepository')
const ProductsRepository = require('../repository/productsRepository')

const productsRepository = new ProductsRepository()

class CartsService {
	constructor() {
		this.repository = new CartsRepository();
	}

	async getCarts() {
		try {
			const carts = await this.repository.getCarts()
			return carts
		} catch (error) {
			throw error
		}
	}

	async getCartById(id) {
		try {
			return this.repository.findById(id)
		} catch (error) {
			throw error
		}
	}

	async addCart() {
		try {
			return this.repository.addCart()
		} catch (error) {
			throw error
		}
	}

	async addProductCart(cid, pid, quantity) {
		try {
			const cart = await this.repository.getCartById(cid)
			if (!cart) throw new Error('Cart not found')

			const product = await productsRepository.getProductById(pid)
			if (!product) throw new Error('Product not found in inventory')

			return this.repository.addProductCart(cid, pid, quantity)
		} catch (error) {
			throw error
		}
	}

	async purchaseCart(data) {
		try {
			const user = data.user
			const cart = await this.repository.getCartById(data.cid)
			if (!cart) throw new Error('Cart not found')

			const { amountCart, productsStock, error } = await this.processProducts(cart[0].products)

			if (error) {
				// Manejar el error específico del procesamiento de productos
				throw new Error(`Error durante el procesamiento de productos: ${error}`);
			}
			const order = {
				amount: amountCart,
				purchaser: user.email,
				productsStock,
			}

			if (productsStock.length === 0) {
				await this.repository.purchaseCart(order) //Finaliza la compra si no hay productos en stock.
			}
			return {
				purchaser: order.purchaser,
				productsStock,
				amount: order.amount
			}
		} catch (error) {
			throw error
		}
	}

	async processProducts(products) {
		// Inicializamos variables
		let amountCart = 0;
		const productsStock = [];

		// Iteramos sobre los productos del carrito
		for (const dataProduct of products) {
			// Obtenemos información del producto desde el repositorio
			const product = await productsRepository.getProductsById(dataProduct.product);

			// Verificamos si el producto existe
			if (!product) {
				return { error: `Producto no encontrado: ${dataProduct.product}` };
			}

			// Verificamos si hay suficiente stock
			if (product.stock >= dataProduct.quantity) {
				// Calculamos el monto del producto y actualizamos el stock
				const productAmount = product.price * dataProduct.quantity;
				amountCart += productAmount;
				product.stock -= dataProduct.quantity;
				await productsRepository.updateProduct(product._id, { stock: product.stock });
			} else {
				// Agregamos el producto al array de productos sin stock suficiente
				productsStock.push(product._id);
			}
		}

		// Manejamos el estado final de la compra
		if (productsStock.length === 0) {
			return { amountCart };
		}

		// Retornamos información sobre la compra
		return { amountCart, productsStock };
	}



	async updateCartProducts(cid, newProduct) {
		try {
			const cart = await this.repository.getCartById(cid)
			if (!cart) throw new Error('Cart not found')

			const stockProducts = await productsRepository.getProducts()
			const products = stockProducts.products

			newProduct.forEach(p => {
				const pId = p.product;
				const quantity = p.quantity;

				if (!pId || !quantity) throw new Error('El producto no tiene stock o id');

				const stockProduct = products.find(p => p._id.toString() === pId)

				if (!stockProduct) throw new Error('El ID proporcionado no pertenece a un producto en stock')
			})

			return this.repository.updateCartProducts(cid, newProduct)
		} catch (error) {
			throw error;
		}
	}

	async updateCartProduct(cid, pid, quantity) {
		try {
			const cart = await this.repository.getCartById(cid)
			const product = await productsRepository.getProductById(pid)

			if (!cart) throw new Error('Cart not found')
			if (!product) throw new Error('Product not found in inventory')

			const stockProductCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);

			if (stockProductCart === -1) throw new Error('El producto no existe')

			return this.repository.updateCartProduct(cid, pid, quantity);
		} catch (error) {
			throw error
		}
	}

	async deleteProductFromCart(cid, pid) {
		try {
			const product = await productsRepository.getProductById(pid)
			const cart = await this.repository.getCartById(cid)

			if (!cart) throw new Error('Cart not found')
			if (!product) throw new Error('Product not found in inventory')

			const stockProductCart = cart[0].products.findIndex((p) => p.product._id.toString() === pid);

			if (stockProductCart === -1) throw new Error('El producto no existe')

			return this.repository.deleteProductFromCart(cid, pid)
		} catch (error) {
			throw error
		}
	}

	async deleteProductsFromCart(cid) {
		try {
			const cart = await this.repository.getCartById(cid)
			if (!cart) throw new Error('Cart not found')

			if (cart[0].products.length === 0) throw new Error('No se pudo borrar los productos');

			return this.repository.deleteProductsFromCart(cid)
		} catch (error) {
			throw error
		}
	}

	async deleteCart(cid) {
		try {
			const cart = await this.repository.getCartById(cid)
			if (!cart) throw new Error('Cart not found')

			return this.repository.deleteCart(cid)
		} catch (error) {
			throw error
		}
	}
}

module.exports = CartsService