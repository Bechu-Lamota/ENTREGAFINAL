const { Router } = require('express')
const ProductsController = require('../controllers/productsController')
const UserMiddleware = require('../middlewares/userMiddleware')
const passportCall = require('../config/passport/passport.call')

const viewsRouter = Router()
const productController = new ProductsController()
const userMiddleware = new UserMiddleware()

viewsRouter.get('/products', async (req, res) => {
    await productController.getProducts(req, res)
})

viewsRouter.get('/realTimeProducts', (req, res) => {
    return res.render('realtimeproducts')
})

viewsRouter.get('/swish',
userMiddleware.isAuth.bind(userMiddleware),
  userMiddleware.hasRole('USER'),
  (req, res) => {
    // Si llega a esta parte, significa que el usuario está autenticado y tiene el rol 'USER'
    return res.render('swish')
})

viewsRouter.post('/swish', (req, res) => {
  const user = req.body
  const userchatname = user.name

  userchatnames.push(userchatname)
      console.log({ userchatname })
  io.emit('newUser', userchatname) 

  return res.redirect(`/chatSwish?username=${userchatname}`)
})

viewsRouter.get('/chatSwish',
  userMiddleware.isAuth.bind(userMiddleware),
  userMiddleware.hasRole('USER'),
  (req, res) => {
  return res.render('swishChat')
})

viewsRouter.get('/register', (req, res) => {
    return res.render('register')
})

viewsRouter.get('/login', (req, res) => {
  const error = req.flash('error')[0]
  console.log({ error })
  return res.render('login', { 
    error,
    hasError: error !== undefined
  })
})

viewsRouter.get('/logout', passportCall('jwt'), async (req, res) => {
  const user = req.user
  try {
    if (req.user.userId !== process.env.ADMIN_ID) {
      await usersService.updateLastConnection(user);
    }
    res.clearCookie('authTokenCookie');
    res.redirect('/')
  } catch (error) {
    res.renderView({
      view: 'error', locals: { title: 'Error', errorMessage: error.message },
    });
  }
});

viewsRouter.get('/profile',  
userMiddleware.isAuth.bind(userMiddleware), 
 (req, res, next) => {
    if (!req.session.user) { //Nos verifica la session, la autenticacion
      return res.redirect('/login')
    }
    return next()
  }, (req, res) => {
    const user = req.session.user
    return res.render('profile', { user })
  })

//ACTIVIDAD RECUPERO DE CONTRASEÑA
viewsRouter.get('/recovery-password', (req, res) => {
  const error = req.flash('error')[0]
  console.log({ error })
  return res.render('recovery-password', { 
    error,
    hasError: error !== undefined
  })
 }) 

viewsRouter.get('/realTimeProducts', (req, res) => {
  return res.render('realtimeproducts')
})

viewsRouter.get('/users', passportCall('jwt'), userMiddleware.hasRole('ADMIN'), async (req, res) => {
  const user = req.user
  try {
    const users = await usersService.getUsers()
    let noUsers = false
    if (!users) noUsers = true
    res.renderView({ view: 'users', locals: { title: 'Users', users, noUsers, user } })
  } catch (error) {
    res.renderView({
      view: 'error', locals: { title: 'Error', errorMessage: error.message },
    });
  }
})


module.exports = viewsRouter