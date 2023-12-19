const generateProductErrorInfo = (product) => {
    return `
    Una o mas de las siguientes propiedades son incorrectas:
      * id: Debe ser tipo Number, se recibio: ${product.id}
      * tittle: Debe ser tipo String, se recibio: ${product.tittle}
      * description: Debe ser tipo String, se recibio: ${product.description}
      * price: Debe ser tipo Number, se recibio: ${product.price}
      * thumbnail: Debe ser tipo String, se recibio: ${product.thumbnail}
      * code: Debe ser tipo String, se recibio: ${product.code}
      * status: Debe ser tipo Boolean, se recibio: ${product.status}
      * stock: Debe ser tipo Number, se recibio: ${product.stock}
      * category: Debe ser tipo String, se recibio: ${product.category}
    `
  }
  
const generateCartErrorInfo = (product) => {
  return `
    Una o más de las siguientes propiedades son incorrectas:
      * id: Debe ser tipo Number, se recibió: ${cart.id}
      * user: Debe ser tipo String, se recibió: ${cart.user}
      * products: Debe ser tipo Array, se recibió: ${JSON.stringify(cart.products)}
      * createdAt: Debe ser tipo Date, se recibió: ${cart.createdAt}
      * updatedAt: Debe ser tipo Date, se recibió: ${cart.updatedAt}
    `
}
module.exports = {
  generateProductErrorInfo,
  generateCartErrorInfo
}