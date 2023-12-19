const { Router } = require('express')
const ProductsController = require('../controllers/productsController')
const ProductsService = require('../service/productsService')
const UserMiddleware = require('../middlewares/userMiddleware')


const productRouterFn = () => {
	const productsRouter = new Router()
	const productsService = new ProductsService()
	const productsController = new ProductsController(productsService)
	const userMiddleware = new UserMiddleware()


	productsRouter.get('/',
		//userMiddleware.isAuth.bind(userMiddleware), 
		productsController.getProducts.bind(productsController)
	)

	productsRouter.get('/:id',
		//userMiddleware.isAuth.bind(userMiddleware), 
		productsController.getProductById.bind(productsController)
	)

	productsRouter.post('/',
		userMiddleware.isAuth.bind(userMiddleware),
		userMiddleware.hasRole('ADMIN', 'PREMIUM'),
		productsController.addProduct.bind(productsController)
	)

	productsRouter.put('/:id',
		userMiddleware.isAuth.bind(userMiddleware),
		userMiddleware.hasRole('ADMIN'),
		productsController.updateProduct.bind(productsController)
	)

	productsRouter.delete('/:id',
		userMiddleware.isAuth.bind(userMiddleware),
		userMiddleware.hasRole('ADMIN'),
		productsController.deleteProduct.bind(productsController)
	)

	return productsRouter
}
module.exports = productRouterFn