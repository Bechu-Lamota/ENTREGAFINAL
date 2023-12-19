const { Router } = require('express')
const UsersController = require('../controllers/usersController')

const usersRouter = new Router()

const usersController = new UsersController()

usersRouter.get('/', usersController.getUsers.bind(usersController))
usersRouter.get('/:id', usersController.getUserById.bind(usersController))
usersRouter.post('/', usersController.addUser.bind(usersController))
usersRouter.put('/:id', usersController.updatedUser.bind(usersController))
usersRouter.delete('/:id', usersController.deletedUser.bind(usersController))
usersRouter.post('/login', usersController.loginUser.bind(usersController))

module.exports = usersRouter