const cartMongoDAO = require('../DAOs/mongo/cartsMongoDAO')

class CartsRepository {
    constructor () {
        this.storage = new cartMongoDAO()
    }
    
    async getCarts() {
        try {
            return await this.storage.getCarts()
        } catch (error) {
            throw new Error("Error al obtener los carritos")
        }
    }

    async getCartById(id) {
        try {
            return await this.storage.getCartById(id)
        } catch (error) {
            throw new Error("No se encuentra el carrito")
        }
    }
    
    async addCart() {
        try {
            return await this.storage.addCart()
        } catch (error) {
            throw new Error("Error al crear el carrito")
        }
    }

    async addProductCart(id, pid, body) {
        try {
            return await this.storage.addProductCart(id, pid, body)
        } catch (error) {
            throw new Error("Error al agregar el producto al carrito")
        }
    }

    async updateCart (id, body) {
        try {
            return await this.storage.updateCart(id, body)
        } catch (error) {
            throw new Error("Error al actualizar el carrito")
        }
    }

    async updateCartProduct (id) {
        try {
            return await this.storage.updateCartProduct(id)        
        } catch (error) {
            throw new Error("Error al actualizar el producto del carrito")
        }
    }

    async updateCartProducts (id, body) {
        try {
            return await this.storage.updateCartProducts(id, body) 
        } catch (error) {
            throw new Error("Error al actualizar los productos del carrito")
        }
    }

    async deleteCart (id) {
        try {
            return await this.storage.deleteCart(id)    
        } catch (error) {
            throw new Error("Error al eliminar el carrito")
        }
    }

    async deleteCartProduct (id, pid) {
        try {
            return await this.storage.deleteCartProduct(id, pid)    
        } catch (error) {
            throw new Error("Error al eliminar el producto del carrito")
        }
    }

    async deleteCartProducts (id) {
        try {
            return await this.storage.deleteCartProducts(id)    
        } catch (error) {
            throw new Error("Error al todos los productos del carrito")
        }
    }

    async purchaseCart (data) {
        try {
            return await this.storage.purchaseCart(data)      
        } catch (error) {
            throw new Error("Error al finalizar la compra del carrito")
        }
    }

}

module.exports = CartsRepository