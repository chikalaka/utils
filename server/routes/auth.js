const express = require("express")
const jwt = require("jsonwebtoken")
const passport = require("passport")
const { SECRET, services, TOKEN_EXPR } = require("../config")
const { now } = require("../helpers/helpers")

const router = express.Router()

const {
  httpPost,
  getServerUrl,
  passportAuth
} = require("../helpers/serverHelpers")

router.get("/isValidToken", passportAuth, (request, response, next) => {
  return response.status(200).json({})
})

router.get(
  "/extendTokenExpiration",
  passportAuth,
  (request, response, next) => {
    const userId = request.localUserId
    const token = jwt.sign({ userId }, SECRET, { expiresIn: TOKEN_EXPR })
    return response.status(200).json({ token })
  }
)

router.post("/login", (request, response, next) => {
  passport.authenticate("local", { session: false }, (error, user, info) => {
    if (error) {
      const defaultMessage =
        error.statusCode === 401
          ? "Unauthorized"
          : "Oops, something went wrong."
      const message = info ? info.message : defaultMessage
      const statusCode = error.statusCode || 500
      return response.status(statusCode).json({ message })
    }

    const token = jwt.sign({ userId: user.id }, SECRET, {
      expiresIn: TOKEN_EXPR
    })

    return response.json({ user, token })
  })(request, response)
})

module.exports = router
