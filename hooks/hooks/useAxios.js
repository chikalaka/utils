/* eslint-disable no-shadow */
import { useState, useEffect } from "react"

const axios = require("axios")

const useAxios = config => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState()
  const [response, setResponse] = useState()
  const [error, setError] = useState()

  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  const request = config => {
    setLoading(true)
    setError()
    setData()
    setResponse()

    let options =
      typeof config === "string"
        ? {
            method: "get",
            url: config,
            cancelToken: source.token
          }
        : { cancelToken: source.token, ...config }

    axios(options)
      .then(response => {
        setResponse(response)
        setData(response.data)
        setLoading(false)
      })
      .catch(error => {
        if (!axios.isCancel(error)) {
          console.error(error)
          setError(error)
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    request(config)

    return () => {
      source.cancel("Operation canceled")
    }
  }, [JSON.stringify(config)])

  return {
    data,
    loading,
    error,
    response,
    rerun: () => {
      request(config)
    }
  }
}

export default useAxios
