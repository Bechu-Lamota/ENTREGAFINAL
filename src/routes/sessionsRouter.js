const { Router } = require('express')
const SessionsController = require('../controllers/sessionsController')

const sessionsRouterFn = () => {
  const sessionsRouter = Router()
  const sessionsController = new SessionsController()



  sessionsRouter.get('/',
    sessionsController.cookie)

  sessionsRouter.post('/register',
    sessionsController.register)

  sessionsRouter.post('/login',
    sessionsController.login)

  sessionsRouter.post('/recovery-password',
    sessionsController.recoveryPassword)

  sessionsRouter.get('/reset-password/:token',
    sessionsController.resetPassword)

  sessionsRouter.post('/reset-password/:token',
    sessionsController.resetToken)

  sessionsRouter.get('/current',
    sessionsController.current)

  sessionsRouter.get('/github',
    sessionsController.github, (req, res) => {
      res.redirect('/api/products')
    })

  sessionsRouter.get('/github-callback',
    sessionsController.githubCallback, (req, res) => {
      res.redirect('/api/products')
    })

  return sessionsRouter
}

module.exports = sessionsRouterFn