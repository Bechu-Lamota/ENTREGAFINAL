const UsersService = require("../repository/usersRepository")
const { verifyToken } = require("../utils/jwt")

class UserMiddleware {
    constructor () {
        this.service = new UsersService()
    }

    async isAuth (req, res, next) {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({
                error: 'Necesitas autenticarte'
            })
        }

        const token = authHeader.replace('Bearer ', '') //El token se puede obtener reemplazando el bearer

        try {
            payload = await verifyToken(token)
        } catch (e) {
            return res.status(401).json({
                error: 'Necesitas autenticarte' //o podemos retornar invalid token -> error: e.message
            })
        }

        const user = this.service.get(payload.userId)

        if (!user) {
            return res.status(401).json({
                error: 'Token invalido'
            })
        }

        req.user = user //inyectamos dentro del request información para que pase de middleware a middleware
        //Con esto el usuario ya esta autenticado

        return next()
    }
    //En POSTMAN agregamos en localhost:8080/api/toys GET -> Headers -> √ Authorization -> Bearer y el codigo del token que se haya generado

    hasRole (...roles) {
        return (req, res, next) => {
            const isValidRole = roles.includes(req.user.role)

            if (!isValidRole) {
                return res.status(403).json({
                    error: 'No tienes permiso para realizar esta acción'
                })
            }
            return next()
        }
    }

    isUser(req, res, next) {
        if (req.user.role !== 'USER') {
            return res.status(403).json({
                error: 'No tienes permiso para realizar esta acción como usuario'
            });
        }
        return next();
    }

}

module.exports = UserMiddleware