const { Router } = require('express');
const passport = require('passport');
const { generateToken } = require('../utils/jwt');
const passportCall = require('../config/passport/passport.call')
const settings = require('../config/command/commander')
const sendMail = require('../config/nodemailer')

const sessionRouter = new Router();

sessionRouter.get('/', (req, res) => {
    if (!req.session.counter) {
      req.session.counter = 1
      req.session.name = req.query.name
  
      return res.json(`Bienvenido ${req.session.name}`)
    } else {
      req.session.counter++
  
      return res.json(`${req.session.name} has visitado la página ${req.session.counter} veces`)
    }
  })
  //CORREGIR QUE ME TIRA UNDEFINED Y NO ME RECONOCE QUE ESTOY CONECTADO CON EL USUARIO
  

sessionRouter.post('/register', 
  passport.authenticate('register', { failureRedirect: '/register' }), 
  async (req, res) => {
    try {
      /*const user = req.user

      await nodeM.sendMail({
        from: `SWISH < ${settings.nodemailer_user}>`,
        to: user.email,
        subject: 'Bienvenido a la comunidad más grande',
        html: `<div>
                    <h1>¿Querés equipara tu casa?</h1>
                    <p> Los mejores precios a tan solo un click, que esperas?</p>
                    <button><a href="http://localhost8080/products">¡VAMOS!</a></button>
                </div>`,
        attachments: []
    });

    */
    return res.status(201).json({ message: '¡El usuario se registró correctamente! Se ha enviado un correo de bienvenida.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el registro', details: error.message });
  }
})

sessionRouter.get('/failregister', (req, res) => {
    return res.json({
      error: 'Error al registrarse'
    })
  })

sessionRouter.post('/login', 
passport.authenticate('login', { 
  failureRedirect: '/login', 
  failureFlash: true 
}),
  async (req, res) => {
    const token = generateToken({
      name: req.user.name,
      email: req.user.email,
      role: req.user.role  // Agregar el rol del usuario al token
    });

    console.log({ token }); // Agrega este registro para verificar el token

    res.cookie('authToken', token, {
      maxAge: 60 * 60 * 1000
    });

    const user = req.session.user; // Considera eliminar la necesidad de usar sessions
    const redirectUrl = user
      ? '/products'
      : '/swish'
    // Redirige a /products si hay un usuario en sesión, de lo contrario a /swish
    res.redirect(redirectUrl)
})

sessionRouter.post('/recovery-password', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email })
  
    if (!user) {
      return res.status(401).json({
        error: 'El usuario no existe en el sistema'
      })
    }
    const newPassword = createHash(req.body.password)
    await userModel.updateOne({ email: user.email }, { password: newPassword })
  
    return res.redirect('/login')
  })

sessionRouter.get('/current', passportCall('jwt'), (req, res) => {
    return res.json({
        user: req.user,
        session: req.session
    })
})
     //INGRESO CON GITHUB
sessionRouter.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {
    return res.redirect('/api/products')
})
       
sessionRouter.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
     //return res.json(req.user) //cambia
     return res.redirect('/api/products')
     })

module.exports = sessionRouter