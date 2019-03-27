const getUrlParamsAsObject = url => {
  let obj = {}
  for (let [key, val] of url.searchParams.entries()) {
    if (!obj[key]) {
      obj[key] = val
    } else {
      obj[key] = [...getDataAsArray(obj[key]), val]
    }
  }
  return obj
}

const getDataAsArray = data => {
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

const omitEmptyProperties = (props = {}) =>
  Object.keys(props).reduce((acc, key) => {
    if (props[key] !== null && props[key] !== undefined) acc[key] = props[key]
    return acc
  }, {})

const getTokenOrLimit = ({ token, limit } = {}) =>
  token ? { token } : { limit }

const isProduction = () => process.env.NODE_ENV === "production"

const now = () => {
  const timeNow = new Date()
  return timeNow.toJSON()
}

const isJsonString = str => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

const parseJson = str => {
  try {
    return JSON.parse(str)
  } catch (e) {
    return null
  }
}

module.exports = {
  isProduction,
  now,
  isJsonString,
  parseJson
}
