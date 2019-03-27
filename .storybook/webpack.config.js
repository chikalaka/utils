const webpack = require("webpack")

module.exports = (baseConfig, env, defaultConfig) => {
  defaultConfig.resolve = {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      "@babel/runtime": "@babel/runtime"
    }
  }

  defaultConfig.node = {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty"
  }

  return defaultConfig
}
