const express = require("express")
let cors = require("cors")
const bodyParser = require("body-parser")
const uuidv4 = require("uuid/v4")
const messages = require("./data/messages")

const app = express()
const PORT = 4000

app.use("/", (req, res, next) => {
  req.time = Date.now()
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({ origin: "http://localhost:3000" }))
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  )
  next()
})

const sendResponse = ({ data, useRequestId = false, timeout = 300 }) => (
  request,
  response
) => {
  let result = data
  if (typeof data === "function") {
    if (useRequestId) result = data(request.params.id)
    else result = data(request.time)
  }
  setTimeout(() => response.send(result), timeout)
}

const sendPostResponse = ({ timeout = 300, customResponseData = {} } = {}) => (
  request,
  response
) => {
  const res = { ...request.body, ...customResponseData }
  setTimeout(() => response.send(res), timeout)
}

app.get(
  "/messages/:id",
  sendResponse({ data: messages })
)

app.listen(PORT, err => {
  if (err) {
    console.log("something bad happened", err)
  }
  console.log(`mock server is listening on ${PORT}`)
})
