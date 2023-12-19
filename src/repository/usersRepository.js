const { isValidObjectId } = require('mongoose')
const usersMongoDAO = require('../DAOs/mongo/usersMongoDAO')
const { generateToken } = require('../utils/jwt')
const { createHash, isValidPassword } = require('../utils/passwordHash')

class usersRepository {
  constructor () {
    this.storage = new usersMongoDAO()
  }

  getUsers () {
    return this.storage.getUsers()
  }

  getUserById (id) {
    if (!isValidObjectId(id)) {
      return undefined
    }
    return this.storage.getUserById(id)
  }

  async addUser(body) {
    try {
      body.password = createHash(body.password); // createHash correctamente
      return this.storage.addUser(body);
    } catch (error) {
      // Manejo el error de manera adecuada
      console.error('Error al agregar el usuario:', error);
      throw new Error('No se pudo agregar el usuario');
    }
  }

  updateUser (id, body) {
    return this.storage.updateUser(id, body)
  }

  deleteUser (id) {
    return this.storage.deleteUser(id)
  }

  loginUser (email, password) {
    const user = this.storage.getByEmail(email)
    if (!user) {
      return false
    }

    if(!isValidPassword(password, user.password)) {
      return false
    }

    const token = generateToken({
      userId: user.id,
      role: user.role
    })

    delete user.password
    user.token = token

    return user
  }
  
}

module.exports = usersRepository