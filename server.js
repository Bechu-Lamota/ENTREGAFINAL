const { app } = require('./src/utils/app')
const productsRouterFn = require('./src/routes/productsRouter')
const productsRouter = productsRouterFn()
const cartsRouterFn = require('./src/routes/cartsRouter')
const cartsRouter = cartsRouterFn()
const usersRouter = require('./src/routes/usersRouter')
const sessionsRouterFn = require('./src/routes/sessionsRouter')
const sessionsRouter = sessionsRouterFn()
const viewsRouter = require('./src/routes/viewsRouter')
const mockingproductsRouter = require('./src/routes/mockingproductsRouter')


app.use('/mock', mockingproductsRouter)
app.use('/api/products', productsRouter)
app.use('/api/users', usersRouter)
app.use('/api/sessions', sessionsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)


//https://entregafinal-production-2973.up.railway.app/