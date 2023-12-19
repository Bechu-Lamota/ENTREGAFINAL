const { Router } = require('express')
const saveProducts = require('../utils/faker')
const compression = require('express-compression')

const mockingproductsRouter = Router()

mockingproductsRouter.use(compression({
	brotli: {
	  enable: true, zlib: {}
	}
  }))

mockingproductsRouter.get('/mockingproducts', async (req, res) => {
    try {
        const products = saveProducts()  // Llama al método saveProducts
        res.send({ status: 200, payload: products, message: 'Productos creados' })
    } catch (error) {
        console.error('Error al crear productos ficticios:', error);
        res.status(500).json({ error: 'Error al crear productos ficticios' })
    }
})

module.exports = mockingproductsRouter