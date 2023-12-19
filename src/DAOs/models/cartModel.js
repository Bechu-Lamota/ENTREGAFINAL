const mongoose = require('mongoose')

 const cartSchema  = mongoose.Schema({
    name: String,
    products: {
        type: [
            {
                productId: { 
                    type: mongoose.Schema.Types.ObjectId, 
                    ref: 'products' 
                },
                quantity: Number
            }
        ],
        default: []
    }
})
/*
cartSchema.pre('find', () => {
    this.populate('products.product')
})
*/
module.exports= mongoose.model('carts', cartSchema)