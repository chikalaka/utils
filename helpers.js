import * as React from 'react'
import moment from 'moment'

export const trimString = (string, maxLength) => {
  if (!string) return ''
  return string.length > maxLength ? (string.substring(0, maxLength) + '...') : string
}

export const runIfExists = (func, ...args) =>
  (func && typeof(func) === 'function') ? func(...args) : func

export const emptyFunc = () => {}

export const identity = value => value

export const getDataAsArray = (data) => {
  if (!data) return []
  return Array.isArray(data) ? data : [data]
}

export const unary = fn => (arg1, ...rest) => fn(arg1)

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
  Object.keys(props).forEach((key) => {
    if (props[key] !== null && props[key] !== undefined) obj[key] = props[key]
  })
  return obj
}

export const extractPropFromProps = propName =>
  (props = {}) => props[propName]

const isRtl = text => {
  const ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF' +
    '\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF'
  const rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC'
  const rtlDirCheck = new RegExp('^[^' + ltrChars + ']*[' + rtlChars + ']')

  return rtlDirCheck.test(text)
}

export const getTextDirection = text => isRtl(text) ? 'rtl' : 'ltr'

export const getNestedProperty = (val, a, ...rest) => {
  if (!a) return val

  const morePropsFromDots = a.split('.')
  const prop = morePropsFromDots.shift()

  return val && getNestedProperty(val[prop], ...morePropsFromDots, ...rest)
}

export const isTextEmpty = text => !text || !(/([^\s])/.test(text))

export const stopEventPropagation = event => event.stopPropagation()

export const fromArrayToObjectByProp = propName => (array = []) => {
  const obj = {}
  array.forEach(element => {
    obj[element[propName]] = element
  })
  return obj
}

const localizeTime = timestamp => {
  const utcTimestamp = moment.utc(timestamp).toDate()
  return timestamp && moment(utcTimestamp).local()
}

export const nowInstant = () => moment().toISOString()

export const hasData = data => {
  if (!data) return false
  if (Array.isArray(data))
    return data.length > 0
  if (typeof data === 'object') {
    if (isError(data)) return true
    return Object.keys(data).length > 0
  }
  return true
}

const isError = value =>
  value instanceof Error && typeof value.message !== 'undefined'

export const bytesToSize = (bytes = 0) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'Petabyte']
  if (bytes === 0) return formatIntlLiteral({id: 'notAvailable'})
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if (i === 0) return `${bytes} ${sizes[i]})`
  return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

export const getFromLocalStorage = (key, defaultValue) => {
  const {localStorage} = window
  const str = key && localStorage && localStorage.getItem(key)

  try {
    return JSON.parse(str)
  } catch (e) {
    return str || defaultValue
  }
}

export const setToLocalStorage = (key, val, callback) => {
  const {localStorage} = window
  const str = typeof val === 'string' ? val : JSON.stringify(val)
  if (key && val && localStorage)
    localStorage.setItem(key, str)
  runIfExists(callback)
}

export const getFilteredResults = ({ hint, array, filterByKey }) => {
  const regex = new RegExp(
    hint
      .toLowerCase()
      .split(' ')
      .map(word => `\\b${word}.*`)
      .join(''))

  return array.filter(element =>
    element[filterByKey] && regex.test(element[filterByKey].toLowerCase())
  )
}

export const dateSort = (a ,b) => {
  if(hasData(a) && hasData(b)){
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
