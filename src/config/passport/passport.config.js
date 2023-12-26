//ESTRATEGIA OPTADA: JWT
const passport = require('passport')
const userModel = require('../../data/DAOs/models/userModel.js')
const loginLocalStrategy = require('../strategies/loginLocalStrategy')
const registerLocalStrategy = require('../strategies/registerLocalStrategy')
const gitHubStrategy = require('../strategies/gitHubStrategy.js')
const jwtStrategy = require('../strategies/jwtStrategy')

const initializePassport = () => {
    passport.use('jwt', jwtStrategy)
    passport.use('register', registerLocalStrategy)
    passport.use('login', loginLocalStrategy)
    passport.use('github', gitHubStrategy)

    passport.serializeUser((user, done) => {
        return done(null, user._id)
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id).populate('cart')
        return done(null, user)
    });
}


module.exports = initializePassport