const {
  addParamToUrlRequest,
  getServerUrl,
  httpPost
} = require("../../../helpers/serverHelpers")
const router = require("express").Router()
const { now } = require("../../../helpers/helpers")
const { services } = require("../../../config")

const postLastAction = ({ time, userId }) => {
  httpPost({
    url: `${getServerUrl({ service: services.users })}/updateLastAction`,
    json: true,
    body: { time, userId }
  })
}

router.use("/", (request, response, next) => {
  const time = now()
  const userId = request.localUserId

  if (userId) {
    postLastAction({ time, userId })

    addParamToUrlRequest({ request, param: "userId", value: userId })
  }
  next()
})

module.exports = router
