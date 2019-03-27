const { isProduction } = require("./helpers")
const proxy = require("express-http-proxy")
const {
  LOCAL_DOMAIN,
  LOCAL_HOST_PORT,
  PRODUCTION_DOMAIN,
  mockServices,
  mockOptions
} = require("../config")
const rp = require("request-promise")
const passport = require("passport")
const url = require("url")

const postDefaultHeaders = {
  "content-type": "application/json"
}

const httpGet = getUrl => rp.get(getUrl)
const httpPost = ({ url: postUrl, json, headers, body }) =>
  rp.post({ url: postUrl, json, headers: headers || postDefaultHeaders, body })

const getServerUrl = ({ service, useMock }) => {
  if (isProduction()) {
    return `http://${service.domain}:${service.port}`
  }
  const mock = useMock !== undefined ? useMock : service.useMock

  const local = `${LOCAL_DOMAIN}:${LOCAL_HOST_PORT}`
  const production = `${PRODUCTION_DOMAIN}:${service.port}`

  if (mockServices === mockOptions.manual) {
    return mock ? local : production
  }
  if (mockServices === mockOptions.mockNone) {
    return production
  }
  return local
}

const getServerDomain = () => {
  const local = `${LOCAL_DOMAIN}:${LOCAL_HOST_PORT}`
  const production = `${PRODUCTION_DOMAIN}:service_port`

  if (mockServices === mockOptions.manual) {
    return "manually set at the config file"
  }
  if (mockServices === mockOptions.mockNone) {
    return production
  }
  return local
}

const proxyToService = ({ service, params, useMock }) => {
  const proxyReqPathResolver = ({ url: locationUrl }) =>
    `${params}${locationUrl}`
  return proxy(getServerUrl({ service, useMock }), {
    proxyReqPathResolver,
    https: false
  })
}

const addParamToUrlRequest = ({ request, param, value }) => {
  const newUrl = url.parse(request.url, true)
  newUrl.search = undefined
  newUrl.query[param] = value
  request.url = url.format(newUrl)
}

module.exports = {
  passportAuth: passport.authenticate("jwt", { session: false }),
  proxyToService,
  httpGet,
  httpPost,
  getServerUrl,
  addParamToUrlRequest,
  getServerDomain
}
