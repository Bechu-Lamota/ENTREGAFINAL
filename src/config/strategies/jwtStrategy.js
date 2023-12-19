const passportJWT = require('passport-jwt')

const JWTStrategy = passportJWT.Strategy
const extractJWT = passportJWT.ExtractJwt

const cookieExtractor = (req) => {
    return req.cookies && req.cookies['authToken'];
    //return req.headers && req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
  }

  const jwtStrategy = new JWTStrategy({
    jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: 'jwtsecret'
}, (jwtPayload, done) => {
    try {
        console.log({ jwtPayload })
        done(null, jwtPayload.user)
    } catch (error) {
        console.error(error)
        done(error, false)
    }
});

  module.exports = jwtStrategy