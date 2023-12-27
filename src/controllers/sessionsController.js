const passport = require('passport')
const { generateToken } = require('../utils/jwt')
const { createHash } = require('../utils/passwordHash')
const passportCall = require('../config/passport/passport.call')
const { sendMail, recoveryMail } = require('../config/nodemailer')
const UsersController = require('../controllers/usersController')

class SessionsController {
	constructor() {
		this.user = new UsersController()
	}

	async cookie(req, res) {
		if (!req.session.counter) {
			req.session.counter = 1
			req.session.name = req.query.name

			return res.json(`Bienvenido ${req.session.name}`)
		} else {
			req.session.counter++

			return res.json(`${req.session.name} has visitado la página ${req.session.counter} veces`)
		}
	}
	//CORREGIR QUE ME TIRA UNDEFINED Y NO ME RECONOCE QUE ESTOY CONECTADO CON EL USUARIO

	async login(req, res) {
		try {
			const { email, password } = req.body
			if (!email || !password) return res.status(400).send({ status: "error", error: "Campo incompleto" })

			const loginUser = await this.user.loginUser(email, password)
			if (!loginUser) {
				return res.status(404).json({
					error: 'No se encontro el usuario'
				})
			}

			passport.authenticate('login', { failureRedirect: '/login', failureFlash: true }) (req, res, () => {
				
				const token = generateToken({
					name: req.user.name,
					email: req.user.email,
					role: req.user.role  // Agregar el rol del usuario al token
				});
				console.log({ token }); // Agrega este registro para verificar el token
				res.cookie('authToken', token, {maxAge: 3600000})

				const user = req.session.user; // Considera eliminar la necesidad de usar sessions
				const redirectUrl = user ? '/products' : '/swish'
				// Redirige a /products si hay un usuario en sesión, de lo contrario a /swish
				res.redirect(redirectUrl)
			})
		} catch (error) {
			console.error(error)
			return res.status(500).json({ error: 'Error al logguearse', details: error.message })
		}
	}

	async recoveryPassword(req, res) {
		try {
			const { email } = req.body
			const user = await this.user.getUserByEmail(email)
			
			if (!user) {
				req.flash('error', 'El usuario no existe en el sistema')
				return res.status(401).redirect('/recovery-password')
			}

			// Genera un token único y almacénalo en el usuario
			const resetToken = createHash(Date.now().toString())
			user.resetToken = resetToken
			user.resetTokenExpiration = Date.now() + 3600000 //Expira en 1 hora
			// Guarda los cambios en el usuario
			await user.save();

			// Envía el correo electrónico
			const mailRecovery = sendMail.recoveryMail(user)
			await sendMail(mailRecovery)

			req.flash('success', 'Se ha enviado un correo de recuperación de contraseña')
			return res.redirect('/recovery-password')
		} catch (error) {
			console.error(error)
			req.flash('error', 'Error al procesar la recuperación de contraseña')
			return res.redirect('/recovery-password')
		}
	}

	async resetPassword(req, res) {
		try {
			const { token } = req.params
			const user = await this.user.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

			if (!user) {
				req.flash('error', 'El enlace de restablecimiento de contraseña no es válido o ha expirado');
				return res.redirect('/recovery-password');
			}

			return res.render('resetPassword', { token });
		} catch (error) {
			console.error(error);
			req.flash('error', 'Error al procesar el restablecimiento de contraseña');
			return res.redirect('/recovery-password');
		}
	}

	async resetToken(req, res) {
		try {
			const { token } = req.params
			const newPassword = createHash(req.body.password);
			const user = await userModel.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });

			if (!user) {
				req.flash('error', 'El enlace de restablecimiento de contraseña no es válido o ha expirado');
				return res.redirect('/recovery-password');
			}

			// Verifica que la nueva contraseña no sea igual a la contraseña actual
			if (newPassword === user.password) {
				req.flash('error', 'La contraseña no puede ser la misma que la actual');
				return res.redirect(`/reset-password/${token}`);
			}

			// Actualiza la contraseña y elimina el token de reseteo
			user.password = newPassword;
			user.resetToken = undefined;
			user.resetTokenExpiration = undefined;

			await user.save();

			req.flash('success', 'Contraseña restablecida con éxito');
			return res.redirect('/login');
		} catch (error) {
			console.error(error);
			req.flash('error', 'Error al procesar el restablecimiento de contraseña');
			return res.redirect('/recovery-password');
		}
	}

	async current(req, res) {
		passportCall('jwt')(req, res, () => {
			return res.json({
				user: req.user,
				session: req.session
			})
		})
	}

}

module.exports = SessionsController