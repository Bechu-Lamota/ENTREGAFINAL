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
		const user = await this.users.findOne({ email })

		if (!user) {
			return false
		}
		if (!isValidPassword(password, user.password)) {
			return false
		}

		const token = generateToken({
			userId: user.id,
			role: user.role,
		});

		delete user.password
		user.token = token

		return user
	}
}

module.exports = UsersMongoDAO