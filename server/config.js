const services = {
  messages: {
    port: 1234,
    domain: "messages",
    useMock: true,
  }
}

const mockOptions = {
  mockAll: "all",
  mockNone: "none",
  manual: "manual"
}

module.exports = {
  services,
  mockOptions,
  PRODUCTION_DOMAIN: `http://my-domain.com`,
  mockServices: mockOptions.mockAll,
  LOCAL_HOST_PORT: 4000,
  LOCAL_DOMAIN: "http://localhost",
  PORT: 5000,
  HTTP_PORT: 5001,
  SECRET: "jwt_secret",
  TOKEN_EXPR: "1d"
}
