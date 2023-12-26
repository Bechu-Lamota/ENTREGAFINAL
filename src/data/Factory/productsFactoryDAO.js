const productsMemoryDAO = require('../DAOs/memory/productsMemoryDAO')
const ProductsMongoDAO = require('../DAOs/mongodb/productsMongoDAO')
const productsMongoDAO = require('../DAOs/mongodb/productsMongoDAO')

const storageMapper = {
	mongo: () => new ProductsMongoDAO(),
	memory: () => new productsMemoryDAO(),
	default: () => new productsMongoDAO(),
}

module.exports = (storage) => {
	console.log({ storage })
	const storageFn = storageMapper[storage] || storageMapper.default

	const dao = storageFn()
	console.log({ dao })

	return dao
}