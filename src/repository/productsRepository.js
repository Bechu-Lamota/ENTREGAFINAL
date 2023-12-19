const ProductsDTO = require('../DAOs/DTOs/productDTO')
const productsFactoryDAO = require('../DAOs/factory/productsFactoryDAO')

class ProductsRepository {
    constructor () {
        this.storage = productsFactoryDAO(process.env.STORAGE)
    }
    
    getProducts () {
        return this.storage.getProducts()
            .then(products => products.map(product => new ProductsDTO(product)))
    }

    getProductsById (id) {
        return this.storage.getProductById(id)
    }
    
    addProduct (body) {
        return this.storage.addProduct(body)
    }

    updateProduct (id, body) {
        return this.storage.updateProduct(id, body)
    }

    deleteProduct (id) {
        return this.storage.deleteProduct(id)
    }


}

module.exports = ProductsRepository