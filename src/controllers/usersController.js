const usersService = require('../service/usersService')

class UsersController {
  constructor () {
    this.service = new usersService()
  }
  
  async getUsers (req, res) {
    try {
      const users = await this.service.getUsers()
      
      return res.json(users)
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      return res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
 
  async getUserById (req, res) {
    try {
      const { id } = req.params
      const user = await this.service.getUserById(id)
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }
  
      return res.json(user)
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'ID no encontrado' })
    }
  }

  async getUserByEmail(req, res) {
    try {
      const { email } = req.params
      const user = await this.service.getUserByEmail(email)

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' })
      }

      return res.json(user)
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Email no encontrado' })
    }
  }  

  async addUser (req, res) {
    try{
      const { body } = req
      const newUser = await this.service.addUser(body)
  
      if (!newUser) {
        return res.status(500).json({ error: 'No se pudo crear el usuario' })
      }
  
      return res.status(201).json(newUser)
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      res.status(500).json({ error: 'No se pudo agregar el usuario' })
    }
  }

  async updatedUser (req, res) {
    try{
      const { id } = req.params
      const { body } = req
  
      const updatedUser = await this.service.updateUser(id, body)
  
      if (!updatedUser) {
        return res.status(500).json({ error: 'No se pudo actualizar el usuario' })
      }
  
      return res.json(updatedUser)
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      res.status(500).json({ error: 'No se pudo actualizar el usuario' })
    }
  }
  
  async deletedUser (req, res) {
    try{
      const { id } = req.params
      const deletedUser = await this.service.deleteUser(id)
  
      if (!deletedUser) {
        return res.status(500).json({ error: 'No se pudo borrar el usuario' })
      }
      
      return res.status(204).json({})
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).json({ error: 'No se pudo eliminar el usuario' })
    }
  }

  async loginUser(req, res) {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).send({ status: "error", error: "Campo incompleto" });
      const userLogeedIn = this.service.loginUser(email, password)

      return res.json({ userLogeedIn })
    } catch (error) {
      console.error('Error al logguearse:', error)
      res.status(500).json({ error: 'No se pudo logguearse' })
    }
  }

  async updateRole(req, res) {
    try {
      const { uid } = req.params
      const { newRole } = req.body

      const result = await this.service.updateRole(uid, newRole)

      if (!result.success) {
        return res.status(400).json({ error: result.message });
      }

      return res.json(result.updatedUser);
    } catch (error) {
      console.error('Error al actualizar el rol del usuario:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  async deleteInactive(req, res) {
    try {
      const usersDeleted = await this.service.deleteInactive()
      res.sendSuccess(200, `${usersDeleted} usuarios eliminados`)
    } catch (error) {
      if (error.message === 'No hay usuarios en la base de datos') return res.sendError(409, 'No hay usuarios en la base de datos por eliminar')
      return res.sendError(500, 'Error al eliminar usuarios inactivos');
    }
  }

 }

module.exports = UsersController