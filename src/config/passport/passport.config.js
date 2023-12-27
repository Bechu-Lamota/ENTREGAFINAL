//ESTRATEGIA OPTADA: JWT
const passport = require('passport')
const loginLocalStrategy = require('../strategies/loginLocalStrategy')
const registerLocalStrategy = require('../strategies/registerLocalStrategy')
const gitHubStrategy = require('../strategies/gitHubStrategy.js')
const jwtStrategy = require('../strategies/jwtStrategy')

const initializePassport = () => {
    passport.use('jwt', jwtStrategy)
    passport.use('register', registerLocalStrategy)
    passport.use('login', loginLocalStrategy)
    passport.use('github', gitHubStrategy)
}


module.exports = initializePassport