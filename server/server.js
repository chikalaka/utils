const express = require("express")
const cors = require("cors")
const { isProduction } = require("./helpers/helpers")
const { passportAuth, getServerDomain } = require("./helpers/serverHelpers")
const auth = require("./routes/auth")
const gateway = require("./routes/gateway/gateway")
const api = require("./routes/api/api")
const external = require("./routes/external")
const bodyParser = require("body-parser")
require("./passport")
const { PORT, HTTP_PORT } = require("./config")
const https = require("https")
const fs = require("fs")

const app = express()
const http = express()

const httpsOptions = {
  key: fs.readFileSync("./certificate/server.key"),
  cert: fs.readFileSync("./certificate/server.cert")
}

const listenOn = ({ port = PORT, protocol, app: listenApp }) => {
  const logs = error => {
    const log = `server ${
      isProduction() ? "" : `(on local machine, domain: ${getServerDomain()})`
    } is listening on ${port}, protocol: ${protocol}`
    if (error) {
      console.log("something went wrong", error)
    } else {
      console.log(log)
    }
  }

  if (protocol === "https") {
    https.createServer(httpsOptions, listenApp).listen(port, logs)
  } else {
    listenApp.listen(port, logs)
  }
}

const configAppApi = () => {
  if (isProduction()) {
    app.use(express.static("build"))
    app.use("/static", express.static("build"))
  } else {
    app.use(cors())
    app.use(function(request, response, next) {
      response.header("Access-Control-Allow-Origin", "*")
      response.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      )
      next()
    })
  }

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use("/api", passportAuth, api)
  app.use("/auth", auth)

  http.get("*", (request, response) => {
    response.redirect("https://" + request.headers.host + request.url)
  })
  if (isProduction()) {
    app.use("*", (request, response) => {
      response.sendFile("/build/index.html")
    })
  }
}

const appStart = () => {
  configAppApi()

  if (isProduction()) {
    listenOn({ protocol: "https", app })
    listenOn({ protocol: "http", app: http, port: HTTP_PORT })
  } else {
    listenOn({ protocol: "http", app })
  }
}

appStart()
