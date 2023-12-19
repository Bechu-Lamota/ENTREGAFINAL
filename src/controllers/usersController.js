const usersRepository = require('../repository/usersRepository')

class UsersController {
  constructor () {
    this.service = new usersRepository()
  }
  
  async getUsers (req, res) {
    try {
      const users = await this.service.getUsers()
      
      return res.json(users)
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      return res.status(500).json({
          error: 'Error interno del servidor'
      })
    }
  }
 
  async getUserById (req, res) {
    try {
      const { id } = req.params
      const user = await this.service.getUserById(id)
  
      if (!user) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        })
      }
  
      return res.json(user)
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ 
        error: 'ID no encontrado' 
      })
    }
  }

  async addUser (req, res) {
    try{
      const { body } = req
      const newUser = await this.service.addUser(body)
  
      if (!newUser) {
        return res.status(500).json({
          error: 'No se pudo crear el usuario'
        })
      }
  
      return res.status(201).json(newUser)
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      res.status(500).json({ 
        error: 'No se pudo agregar el usuario' 
      })
    }
  }

  async updatedUser (req, res) {
    try{
      const { id } = req.params
      const { body } = req
  
      const updatedUser = await this.service.updatedUser(id, body)
  
      if (!updatedUser) {
        return res.status(500).json({
          error: 'No se pudo actualizar el usuario'
        })
      }
  
      return res.json(updatedUser)
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ 
        error: 'No se pudo actualizar el usuario' 
      })
    }
  }
  
  async deletedUser (req, res) {
    try{
      const { id } = req.params
      const deletedUser = await this.service.deletedUser(id)
  
      if (!deletedUser) {
        return res.status(500).json({
          error: 'No se pudo borrar el usuario'
        })
      }
      
      return res.status(204).json({})
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ 
        error: 'No se pudo eliminar el usuario' 
      })
    }
  }

  async loginUser (req, res) {
    try {
      const { email, password } = req.body
      const userLogeedIn = this.service.loginUser(email, password)
      
      return res.json({
        userLogeedIn
      })
    } catch (error) {
      console.error('Error al logguearse:', error);
      res.status(500).json({ 
        error: 'No se pudo logguearse' 
      })
    }
  }
 }

module.exports = UsersController