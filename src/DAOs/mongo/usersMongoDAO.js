const usersModel = require('../models/userModel')

class UsersMemory {
    constructor () {
      this.users = usersModel
    }
  
    getUsers () {
      return this.users.find()
    }
  
    getUserById (id) {
      const user = this.users.findById(id)

      return user
    }

    getByEmail (email) {
      const user = this.users.find(user => user.email === email)
      return user
    }
  
    addUser (user) {
      user.id = this.users.length + 1
      this.users.push(user)
      return user
    }
  
    updateUser (id, body) {
      const user = this.getUserById(id)
      if (!user) {
        return false
      }
      user = {...user, ...body}
      return user
    }
  
    deleteUser (id) {
      const user = this.getUserById(id)
      if (!user) {
        return false
      }
      this.users = this.users.slice(user, 1)
      return true
    }

  }
  
  module.exports = UsersMemory