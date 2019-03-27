import React, { useMemo, useState } from "react"

const useProp = (callback, deps, initialValue) => {
  const [prop, setProp] = useState(initialValue)
  useMemo(() => setProp(callback()), deps)
  return prop
}

export default useProp
