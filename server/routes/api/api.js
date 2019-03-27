const router = require("express").Router()
const { proxyToService } = require("../../helpers/serverHelpers")
const { services } = require("../../config")
const base = require("./routes/base")

router.use("/", base)
router.use(
  "/messages",
  proxyToService({ service: services.messages, params: "/messages" })
)

module.exports = router
