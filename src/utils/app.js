const express = require('express')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const initializePassport = require('../config/passport/passport.config')
const passport = require('passport')
const DB = require('../config/command/singleton')
const settings = require('../config/command/commander')
DB.getConnection(settings)
const addLogger = require('./logger')
//Swagger
const swaggerDocs = require('swagger-jsdoc')
const swaggerUiExpress = require('swagger-ui-express')

const app = express()

// Middleware para el logger
app.use(addLogger)

app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.engine('handlebars', handlebars.engine())
app.set('views', './src/views')
app.set('view engine', 'handlebars')

app.use(express.static('public'))

app.use(flash())
app.use(cookieParser('secretCookie'))
app.use(session({
	secret: 'secretSession',
	resave: true,
	saveUninitialized: true
}))
initializePassport()
app.use(passport.initialize())

//SWAGGER
const swaggerOptions = {
	definition: {
		openapi: '3.0.1',
		info: {
			title: 'Documentación de SWISH',
			description: 'API para gestión de ecommerce'
		}
	},
	apis: [
		`./src/docs/**/*.yaml`
	]
}

const specs = swaggerDocs(swaggerOptions)
app.use('/api/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

/*
//SIN RAILWAY
const PORT = 8080
const httpServer = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))
*/
//Con RAILWAY
const PORT = process.env.PORT || 8080
console.log(`Servidor corriendo en el puerto ${PORT}`)

const io = new Server(httpServer)
const users = []
const messages = []

io.on('connection', socket => {
	console.log('Nuevo cliente conectado')

	socket.on('joinChat', username => {
		users.push({
			name: username,
			socketId: socket.id
		})

		socket.broadcast.emit('notification', `${username} se ha unido a la conversacion`)
		socket.emit('notification', `Te has unido a la conversacion ${username}`)
		socket.emit('messages', JSON.stringify(messages))
	})

	//Ahora cachamos el mensaje del front end desde el backend:
	socket.on('newMessage', message => {
		const user = users.find(user => user.socketId === socket.id)
		
		const newMessage = {
			message,
			user: user.name
		}
		messages.push(newMessage)
		console.log(newMessage)

		io.emit('message', JSON.stringify(newMessage))
	})
})

app.get('/', (req, res) => {
  res.json({
      message: 'Welcome',
      status: 'running', 
      date: new Date()
  })
})

app.get('/loggerTest', (req, res) => {
	//dev
	req.logger.debug('Prueba de Desarrollo')

	//prod 
	req.logger.info('Prueba en producción de consola')
	req.logger.error('Fallo prueba en producción de archivo')
	req.logger.warning('Fallo prueba en producción de archivo')

	res.send({ message: 'Prueba de logger, Correcta!' })
})


module.exports = {
    app,
    io
}