const { Router } = require('express')
const passport = require('passport')
const SessionsController = require('../controllers/sessionsController')
const UsersController = require('../controllers/usersController')

const sessionsRouterFn = () => {
  const sessionsRouter = Router()
  const sessionsController = new SessionsController()
  const usersController = new UsersController()



  sessionsRouter.get('/',
    sessionsController.cookie)

  sessionsRouter.post('/register',
    async (req, res, next) => {
      try {
        const { body } = req;
        const newUser = await usersController.addUser(body);

        if (!newUser) {
          // Si no se pudo crear el usuario, responde con un error 500
          console.error('Error al registrar el usuario');
          return res.status(500).json({ error: 'Error al registrarse' });
        }

        // Lógica personalizada después del registro exitoso
        const mailRegister = sendMail.registerMail(newUser.email);
        sendMail(mailRegister);

        // Continúa con la autenticación usando passport.authenticate
        passport.authenticate('register', (err, user, info) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al autenticarse', details: err.message });
          }
          if (!user) {
            console.error(info.message);
            return res.status(401).json({ error: info.message });
          }

          // Autenticación exitosa, enviar una respuesta JSON
          return res.status(201).json({
            message: '¡El usuario se registró correctamente! Se ha enviado un correo de bienvenida.',
          });
        })(req, res, next);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al registrarse', details: error.message });
      }
    }
  );


  sessionsRouter.post('/login',
    sessionsController.login)

  sessionsRouter.post('/recovery-password',
    sessionsController.recoveryPassword)

  sessionsRouter.get('/reset-password',
    sessionsController.resetPassword)

  sessionsRouter.post('/reset-password/:token',
    sessionsController.resetToken)

  sessionsRouter.get('/current',
    sessionsController.current)

  //INGRESO CON GITHUB
  sessionsRouter.get('/github', passport.authenticate('github', { scope: ['user: email'] }), async (req, res) => {
    return res.redirect('/api/products')
  })

  sessionsRouter.get('/github-callback', passport.authenticate('github', { failureRedirect: '/userLogin', failureFlash: true }), async (req, res) => {
    //return res.json(req.user) //cambia
    return res.redirect('/api/products')
  })

  return sessionsRouter
}

module.exports = sessionsRouterFn