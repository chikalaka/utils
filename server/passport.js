const passport = require("passport")
const passportJWT = require("passport-jwt")
const LocalStrategy = require("passport-local").Strategy
const { httpPost, getServerUrl } = require("./helpers/serverHelpers")
const { services, SECRET } = require("./config")

const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },
    (username, password, callback) => {
      return httpPost({
        url: `${getServerUrl({ service: services.users })}/checkCredentials`,
        json: true,
        body: { username, password }
      })
        .then(user => {
          if (!user) {
            return callback(null, false, {
              message: "Incorrect username or password."
            })
          }
          return callback(null, user, { message: "Logged In Successfully" })
        })
        .catch(callback)
    }
  )
)

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: (...params) =>
        ExtractJWT.fromAuthHeaderAsBearerToken()(...params) ||
        ExtractJWT.fromUrlQueryParameter("gatewayToken")(...params),
      secretOrKey: SECRET,
      passReqToCallback: true
    },
    function(request, jwtPayload = {}, callback) {
      const userId = jwtPayload.userId

      request.localUserId = userId

      return userId
        ? callback(null, userId)
        : callback(
            new Error("An error occurred while trying to decode the jwt")
          )
    }
  )
)
