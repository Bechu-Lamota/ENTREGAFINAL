const { isValidObjectId } = require('mongoose')
const usersMongoDAO = require('../data/DAOs/mongodb/usersMongoDAO')
const { createHash } = require('../utils/passwordHash')

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

  getUserByEmail(email) {
    if (!isValidObjectId(email)) {
      return undefined
    }
    return this.storage.getUserByEmail(email)
  }

  async addUser(body) {
    try {
      body.password = createHash(body.password) // createHash correctamente
      return this.storage.addUser(body)
    } catch (error) {
      // Manejo el error de manera adecuada
      console.error('Error al agregar el usuario:', error)
      throw new Error('No se pudo agregar el usuario')
    }
  }

  updateUser (id, body) {
    return this.storage.updateUser(id, body)
  }

  deleteUser (id) {
    return this.storage.deleteUser(id)
  }

  loginUser(email, password) {
    return this.storage.loginUser(email, password)
  }

  updateRole(uid, newRole) {
    return this.storage.updateRole(uid, newRole)
  }

  async updateLastConnection(user) {
    return this.storage.updateLastConnection(user)
  }
  
  async deleteInactive(usersToDelete) {
    return this.storage.deleteInactive(usersToDelete)
  }

}

module.exports = usersRepository