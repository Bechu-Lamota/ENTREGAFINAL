const { generateToken } = require('../../../utils/jwt')
const { isValidPassword } = require('../../../utils/passwordHash')
const usersModel = require('../models/userModel')

class UsersMongoDAO {
	constructor() {
		this.users = usersModel
	}

	getUsers() {
		return this.users.find()
	}

	getUserById(id) {
		const user = this.users.findById(id)

		return user
	}

	getUserByEmail(email) {
		const user = this.users.find(user => user.email === email)
		return user
	}

	addUser(user) {
		user.id = this.users.length + 1
		this.users.push(user)
		return user
	}

	updateUser(id, body) {
		const user = this.getUserById(id)
		if (!user) {
			return false
		}
		user = { ...user, ...body }
		return user
	}

	deleteUser(id) {
		const user = this.getUserById(id)
		if (!user) {
			return false
		}
		this.users = this.users.slice(user, 1)
		return true
	}

	async loginUser(email, password) {
		try {
			const user = await this.users.findOne({ email })
			if (!user) {
				return { error: 'Usuario no encontrado' }
			}
			
			if (!isValidPassword(password, user.password)) {
				return { error: 'Contraseña incorrecta' }
			}

			const token = generateToken({
				userId: user.id,
				role: user.role,
			})

			delete user.password
			user.token = token

			return user
		} catch (error) {
			console.error(error);
			return { error: `Error interno del servidor: ${error.message}` }
		}
	}

	async updateRole(uid, newRole) {
		try {
			const user = await this.users.findById(uid)

			if (!user) {
				return { success: false, message: 'Usuario no encontrado'}
			}
			//Controlamos los documentos requeridos
			if (newRole === 'PREMIUM' && (!user.documents || !user.documents.identificacion || !user.documents.comprobanteDomicilio || !user.documents.comprobanteEstadoCuenta)) {
				return { success: false, message: 'Faltan cargar documentos para ser premium' }
			}
			// Update user role
			const updatedUser = await this.users.findByIdAndUpdate(uid, {
				role: newRole
			}, { new: true })
			return { success: true, updatedUser }
		} catch (error) {
			console.error(error)
			return { success: false, message: `Error interno del servidor ${error.message}` }
		}
	}

	async updateLastConnection(user) {
		const userId = user.userId || user._id
		try {
			const userToUpdate = await this.model.findOne({ _id: userId })
			if (!userToUpdate) throw new Error('User not found');
			await this.model.updateOne({ _id: userId }, { last_connection: new Date() })
		} catch (error) {
			throw error
		}
	} 

	async deleteInactive() {
		try {
			const twoDaysAgo = new Date()
			twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

			const usersInactive = await this.users.find({ last_connection: { $lt: twoDaysAgo } })

			if (usersInactive.length === 0) {
				throw new Error('No users in database to delete')
			}

			const usersDelete = usersInactive.map(user => user._id)

			for (const uid of usersDelete) {
				const user = await this.model.findOne({ _id: uid })
				if (user.cart) {
					await cartsService.deleteCart(user.cart)
				}
			}

			const result = await this.users.deleteMany({ _id: { $in: usersDelete } })

			return result.deletedCount
		} catch (error) {
			throw error
		}
	}
}

module.exports = UsersMongoDAO