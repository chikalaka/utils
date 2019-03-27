import * as React from "react"
import moment from "moment"
import { formatIntlLiteral } from "with-react-intl"
import { FormattedMessage } from "react-intl"

/* eslint-disable no-buffer-constructor */

export const getUrlParameter = (locationSearch, parameterName) => {
  const query = new URLSearchParams(locationSearch)
  return query.get(parameterName)
}

export const buildUrlQuery = (locationSearch, parameterKey, parameterValue) => {
  const query = new URLSearchParams(locationSearch)
  query.set(parameterKey, parameterValue)
  return query
}

export const getParametersFromURL = (locationSearch, parameterName) => {
  const query = new URLSearchParams(locationSearch)
  return query.getAll(parameterName)
}

export const setParametersToUrl = (locationSearch, parametersObject) => {
  let query = new URLSearchParams(locationSearch)
  Object.keys(parametersObject).forEach(key => {
    const parametersValue = parametersObject[key]
    if (Array.isArray(parametersValue)) {
      parametersValue.forEach(value =>
        queryAppendWithoutNullables(query, key, value)
      )
    } else {
      queryAppendWithoutNullables(query, key, parametersValue)
    }
  })
  return query
}

const queryAppendWithoutNullables = (query, key, value) =>
  hasData(value) && query.append(key, value)

export const encodeData = data => {
  if (data)
    return Object.keys(data)
      .map(key => [key, data[key]].map(encodeURIComponent).join("="))
      .join("&")
  return ""
}

export const trimStringByLength = (string, maxLength) => {
  if (!string) return ""
  return string.length > maxLength
    ? string.substring(0, maxLength) + "..."
    : string
}

const toLowerCase = string => string.toLowerCase()
// const tagsExtractionRegex = /\B#[a-zA-Z0-9]+(_[a-zA-Z0-9]+|[a-zA-Z0-9]*)+/g
const simpleTagsExtractionRegex = /#\S+/g

export const extractTagsFromText = (text = "") => {
  const matchedArray = text.match(simpleTagsExtractionRegex)
  if (!matchedArray) return []
  return matchedArray.map(toLowerCase)
}

export const runIfExists = (func, ...args) =>
  func && typeof func === "function" ? func(...args) : func

export const emptyFunc = () => {}
export const identity = value => value
export const getDataAsArray = data => {
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

export const unary = fn => (arg1, ...rest) => fn(arg1)

export const isArrayIncludesArray = (array, subArray) =>
  subArray.every(value => array.includes(value))

// instead of: ({ comments, tags, relevance }) => ({ comments, tags, relevance })
// write: fromPropsToObj('comments', 'tags', 'relevance')
export const fromPropsToObj = (...argsNames) => (props = {}) => {
  let obj = {}
  argsNames.forEach(name => {
    obj[name] = props[name]
  })
  return obj
}

export const omitEmptyProperties = (props = {}) => {
  let obj = {}
  Object.keys(props).forEach(key => {
    if (props[key] !== null && props[key] !== undefined) obj[key] = props[key]
  })
  return obj
}

export const extractPropFromProps = propName => (props = {}) => props[propName]

const isRtl = text => {
  const ltrChars =
          "A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF" +
          "\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF"
  const rtlChars = "\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC"
  const rtlDirCheck = new RegExp("^[^" + ltrChars + "]*[" + rtlChars + "]")

  return rtlDirCheck.test(text)
}

export const getTextDirection = text => (isRtl(text) ? "rtl" : "ltr")

export const getNestedProperty = (val, a, ...rest) => {
  if (!a || !val) return undefined

  const morePropsFromDots = a.split(".")
  const prop = morePropsFromDots.shift()

  if (val && !val[prop]) return undefined

  if (rest.length === 0 && morePropsFromDots.length === 0) {
    return val[prop]
  }

  return val && getNestedProperty(val[prop], ...morePropsFromDots, ...rest)
}

export const isTextEmpty = text => !text || !/([^\s])/.test(text)

export const stopEventPropagation = event => event.stopPropagation()

const DEFAULT_DATE_FORMAT = "DD/MM/YYYY"

export const formatNullableValue = ({ value, capitalLetter = true }) => {
  return (
    value || (
      <FormattedMessage
        id={`general.${
          capitalLetter ? "unknownValueCapitalLetter" : "unknownValue"
          }`}
      />
    )
  )
}

export const formatNullableDate = ({
                                     timestamp,
                                     format,
                                     capitalLetter = true
                                   }) => {
  if (!timestamp)
    return formatIntlLiteral({
      id: `general.${
        capitalLetter ? "unknownTimeCapitalLetter" : "unknownTime"
        }`
    })
  return localizeTime(timestamp).format(format || DEFAULT_DATE_FORMAT)
}

export const isToday = timestamp => {
  const momentTimestamp = localizeTime(timestamp)
  const today = moment()
    .clone()
    .startOf("day")
  return !!(momentTimestamp && momentTimestamp.isSame(today, "d"))
}

export const isYesterday = timestamp => {
  const momentTimestamp = localizeTime(timestamp)
  const yesterday = moment()
    .clone()
    .subtract(1, "days")
    .startOf("day")
  return !!(momentTimestamp && momentTimestamp.isSame(yesterday, "d"))
}

export const isSameDate = (timestamp1, timestamp2) => {
  return (
    timestamp1 &&
    timestamp2 &&
    moment(timestamp1).isSame(moment(timestamp2), "day")
  )
}

export const formatDateLiteral = ({
                                    timestamp,
                                    format,
                                    onlyDateFormat = false,
                                    capitalLetter = true
                                  }) => {
  if (!timestamp)
    return formatIntlLiteral({
      id: `general.${
        capitalLetter ? "unknownDateCapitalLetter" : "unknownDate"
        }`
    })
  if (isToday(timestamp) && !onlyDateFormat)
    return formatIntlLiteral({
      id: `general.${capitalLetter ? "todayCapitalLetter" : "today"}`
    })
  if (isYesterday(timestamp) && !onlyDateFormat)
    return formatIntlLiteral({
      id: `general.${capitalLetter ? "yesterdayCapitalLetter" : "yesterday"}`
    })
  return localizeTime(timestamp).format(format || DEFAULT_DATE_FORMAT)
}

const localizeTime = timestamp => {
  const utcTimestamp = moment.utc(timestamp).toDate()
  return timestamp && moment(utcTimestamp).local()
}

export const nowInstant = () => moment().toISOString()

export const formatDuration = ({ duration, unit, format } = {}) =>
  moment(moment.duration(duration, unit || "seconds").asMilliseconds()).format(
    format || "mm:ss"
  )

export const hasData = data => {
  if (!data) return false
  if (Array.isArray(data)) return data.length > 0
  if (typeof data === "object") {
    if (isError(data)) return true
    return Object.keys(data).length > 0
  }
  return true
}

const isError = value =>
  value instanceof Error && typeof value.message !== "undefined"

const isPrimitiveFalse = value => value === 0 || value === false

/* eslint-disable no-restricted-syntax */
export const hasNoDataOrOnlyNullFields = data => {
  if (hasData(data)) {
    if (typeof data === "object" && !isError(data)) {
      for (let value of Object.values(data)) {
        if (!hasNoDataOrOnlyNullFields(value)) return false
      }
      return true
    }
    return false
  }
  return !isPrimitiveFalse(data)
}
/* eslint-enable no-restricted-syntax */

export const bytesToSize = (bytes = 0) => {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "Petabyte"]
  if (bytes === 0) return formatIntlLiteral({ id: "notAvailable" })
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`
}

export const getClosestValue = ({ array = [], value = 0 }) => {
  const numArray = array.map(element => Number(element))
  let diff = Infinity
  let result = null

  numArray.forEach(num => {
    const newDiff = Math.abs(num - value)
    if (newDiff < diff) {
      diff = newDiff
      result = num
    }
  })
  return result
}

export const parseStringToValue = string => {
  try {
    return JSON.parse(string)
  } catch (e) {
    return string
  }
}

export const getFromStorage = key => {
  const { localStorage } = window
  const str = key && localStorage && localStorage.getItem(key)

  return parseStringToValue(str)
}

export const setToStorage = (key, val, callback) => {
  const { localStorage } = window
  const str = typeof val === "string" ? val : JSON.stringify(val)
  if (key && val && localStorage) localStorage.setItem(key, str)
  runIfExists(callback)
}

export const getFilteredResults = ({ hint, array, filterByKey }) => {
  const regex = new RegExp(
    hint
      .toLowerCase()
      .split(" ")
      .map(word => `\\b${word}.*`)
      .join("")
  )

  return array.filter(
    element =>
      element[filterByKey] && regex.test(element[filterByKey].toLowerCase())
  )
}

export const dateSort = (a, b) => {
  if (hasData(a) && hasData(b)) {
    if (moment(a).isBefore(b)) {
      return -1
    }
    if (moment(a).isAfter(b)) {
      return 1
    }
    return 0
  }
  return null
}

export const imageBinaryToBase64 = str => {
  return `data:image/jpeg;base64,${new Buffer(str, "binary").toString(
    "base64"
  )}`
}

export const fullNameValidator = inputValue =>
  inputValue.length > 0 && inputValue.length <= 60
export const passwordValidator = inputValue =>
  inputValue.length >= 6 && inputValue.length <= 20
export const usernameValidator = inputValue =>
  /^[\\/a-zA-Z0-9_.-]+$/.test(inputValue)

export const getClickableCursorClass = condition =>
  condition ? "clickable" : "disabled"

export const getThemeProperty = key =>
  getComputedStyle(document.body)
    .getPropertyValue(key)
    .trim()

export const getThemePropertyAsNumber = cssVar =>
  parseFloat(getThemeProperty(cssVar), 10)

export const hexToRgba = (hex, alpha = 1) => {
  if (!hex) return ""
  const hexStr = hex.replace("#", "")
  let r
  let g
  let b
  if (hexStr.length === 6) {
    r = parseInt(hexStr.substring(0, 2), 16)
    g = parseInt(hexStr.substring(2, 4), 16)
    b = parseInt(hexStr.substring(4, 6), 16)
  } else if (hexStr.length === 3) {
    const rd = hexStr.substring(0, 1) + hexStr.substring(0, 1)
    const gd = hexStr.substring(1, 2) + hexStr.substring(1, 2)
    const bd = hexStr.substring(2, 3) + hexStr.substring(2, 3)
    r = parseInt(rd, 16)
    g = parseInt(gd, 16)
    b = parseInt(bd, 16)
  } else {
    console.error(
      "Invalid color passed to hexToRgba function, color passed: " + hex
    )
    return ""
  }

  return `rgba(${r},${g},${b},${alpha})`
}

export const getClassName = (...classNames) =>
  classNames
    .map(name => {
      if (typeof name === "string") return name
      return ""
    })
    .filter(identity)
    .join(" ")

export const getUrlWithParams = ({ url, ...props } = {}) => {
  let divider
  const params = omitEmptyProperties({ ...props })
  const query = setParametersToUrl("", params).toString()
  const questionMarkIndex = url.indexOf("?")
  if (questionMarkIndex === -1) {
    divider = query ? "?" : ""
  } else if (questionMarkIndex === url.length - 1) {
    divider = ""
  } else {
    divider = "&"
  }

  return url + divider + query
}

export const getSortedVisits = (visits = []) =>
  visits
    .sort((time1 = {}, time2 = {}) =>
      dateSort(time1.startTime, time2.startTime)
    )
    .reverse()
