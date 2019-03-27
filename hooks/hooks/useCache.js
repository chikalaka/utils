import React, { useMemo, useState, useEffect } from "react"

const useCache = (callback, cacheBy = [], resetCacheBy = []) => {
  const [cache, setCache] = useState({})
  const [result, setResult] = useState()

  useMemo(() => {
    const inputHash = JSON.stringify(cacheBy)
    if (!cache[inputHash]) {
      const _result = callback()
      setCache(cachedState => ({ ...cachedState, [inputHash]: _result }))
      setResult(_result)
    } else {
      setResult(cache[inputHash])
    }
  }, cacheBy)

  useEffect(() => {
    const inputHash = JSON.stringify(cacheBy)
    const _result = callback()
    setCache({ [inputHash]: _result })
    setResult(_result)
  }, resetCacheBy)

  return result
}

export default useCache
