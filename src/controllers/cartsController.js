const { purchaseMailReject } = require('../config/nodemailer')
const CartsService = require('../service/cartsService')


class CartsController {
  constructor() {
    this.service = new CartsService()
  }

  async getCarts(req, res) {
    try {
      const carts = await this.service.getCarts()
      res.json(carts)
    } catch (error) {
      console.error(`Error fetching carts: ${error.message}`)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async getCartById(req, res) {
    const { id } = req.params
    try {
      const cart = await this.service.getCartById(id)
      if (!cart) {
        res.status(404).json({ error: 'Carrito no encontrado' })
      } else {
        res.json(cart)
      }
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async addCart(req, res) {
    try {
      const cart = await this.service.addCart()
      res.status(201).json(cart)
    } catch (error) {
      console.error(`Error adding cart: ${error.message}`)
      res.status(500).json({ error: error.message })
    }
  }

  async addProductCart(req, res) {
    const { id, pid } = req.params

    try {
      await cartsService.addProductToCart(id, pid)
      res.json({ message: 'Product added to cart successfully' })
    } catch (error) {
      console.error(`Error adding product to cart: ${error.message}`)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  async purchaseCart(req, res) {
    const { cid } = req.params
    const { user } = req.body
    try {
      const result = await this.service.purchaseCart({ cid, user })

      if (!result) {
        const mailReject = purchaseMailReject(user.email)
        await sendMail(mailReject)
        return res.status(400).json({ error: 'No se pudo procesar su compra' })
      }

      const mailOptions = purchaseMail(user, result)
      await sendMail(mailOptions)

      res.json(result)
    } catch (error) {
      console.error(`Error purchasing cart: ${error.message}`)
      res.status(500).json({ error: error.message })
    }
  }

  async updateCart(req, res) {
    const { cid } = req.params
    const { body } = req
    try {
      const updatedCart = await this.service.updateCartProducts(cid, body)
      res.json(updatedCart)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async updateCartProduct(req, res) {
    const { cid, pid } = req.params
    const { quantity } = req.body
    try {
      const updatedProduct = await this.service.updateCartProduct(cid, pid, quantity)
      res.json(updatedProduct)
    } catch (error) {
      console.error(`Error updating cart product: ${error.message}`)
      res.status(500).json({ error: error.message })
    }
  }

  async deleteCart(req, res) {
    const { cid } = req.params
    try {
      await this.service.deleteCart(cid)
      res.json({ message: 'Carrito eliminado correctamente' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }

  async deleteCartProduct(req, res) {
    const { cid, pid } = req.params
    try {
      const cart = await this.service.deleteCartProduct(cid, pid)
      res.json({ cart, message: 'Product deleted from cart successfully' })
    } catch (error) {
      console.error(`Error deleting product from cart: ${error.message}`)
      res.status(500).json({ error: error.message })
    }
  }

  async deleteCartProducts(req, res) {
    const { cid } = req.params
    try {
      const cart = await this.service.deleteCartProducts(cid)
      res.json({ cart, message: 'All products deleted from cart successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}

module.exports = CartsController


