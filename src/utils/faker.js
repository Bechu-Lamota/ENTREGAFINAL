const { faker } = require('@faker-js/faker')

const saveProducts = () => {
    let products = []
    for (let i = 0; i < 100; i++) {
        products.push(generateProduct())
    }
    return{
        products
    }
}

const generateProduct = () => {
    return{
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 1, max: 2000, symbol: '$'}),
        thumbnail: faker.internet.avatar(),
        code: faker.commerce.isbn(),
        stock: faker.number.int({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(0.75)

    }
}

module.exports = saveProducts