const ProductsService = require('../repository/productsRepository')
const CustomError = require('../service/customError')
const generateProductErrorInfo = require('../service/infoError')
const EErrors = require('../service/enums')

class ProductsController {
    constructor (io) {
        this.service = new ProductsService()
        this.io = io
    }

    async getProducts(req, res) {
        try {
          const { limit } = req.query || 10
          const { page } = req.query || 1
          const products = await this.service.getProducts( limit, page )
          
          if (!products) {
            return res.status(404).json({
              error: 'No se encontraron productos'
            })
          }

          return res.json(products)
          return res.render('products', { products });
        } catch (error) {
            return res.status(500).json({error: 'Error interno del servidor' })
        }
    }

    async getProductById (req, res) {
      try {
        const { id } = req.params
        const product = await this.service.getProductsById(id)
    
        if (!product) {
          return res.status(404).json({
            error: 'Producto no encontrado'
          })
        }
    
        return res.status(200).json('Success, producto obtenido según su ID')
      } catch (error) {
        res.status(500).json({ error: 'ID del producto no encontrado' })
      }
    }
    
    async addProduct (req, res ) {
      try{
        const { id, tittle, description, price, code, thumbnail, status, stock, category } = req.body

        if(!id || !tittle || !description || !price || !code || !thumbnail || !status || !stock || !category) {
          throw CustomError.generateError({
            name: 'User Creation Error',
            cause: generateProductErrorInfo({ id, tittle, description, price, code, thumbnail, status, stock, category }),
            message: 'Error al tratar de crear el producto',
            code: EErrors.INVALID_TYPES_ERROR
          })
        }

        const ownerMail = req.user ? req.user.email : null
        if (!ownerMail) {
          return res.status(401).json({ error: 'Usuario no autenticado'})
        }

        const bodyOwner = { ...req.body, owner: ownerMail }
        const newProduct = await this.service.addProduct(bodyOwner)
    
        if (!newProduct) {
          return res.status(500).json({
            error: 'No se pudo crear el producto'
          })
        }

        this.io.emit('body', JSON.stringify(newProduct))
        return res.status(201).json(newProduct)
      } catch (error) {
        console.error('Error al agregar producto:', error);
        res.status(500).json({ error: 'No se pudo agregar producto' })
      }
    }
    
    async updateProduct (req, res) {
      try{
        const { id } = req.params
        const { body } = req
        const updatedProduct = await this.service.updateProduct(id, body)
    
        if (!updatedProduct) {
          return res.status(500).json({
            error: 'No se pudo actualizar el producto'
          })
        }
    
        return res.json(updatedProduct)
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ 
          error: 'No se pudo actualizar producto' 
        })
      }
    }
    
    async deleteProduct (req, res) {
      try {
        const { id } = req.params
        const deletedProduct = await this.service.deleteProduct(id)
    
        if (!deletedProduct) {
          return res.status(500).json({
            error: 'No se pudo borrar el producto'
          })
        }
        
        return res.status(204).json({})
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ 
          error: 'No se pudo eliminar producto' 
        })
      }
      }
     }
     
module.exports = ProductsController