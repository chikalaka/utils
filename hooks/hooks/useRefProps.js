import React, { useEffect, useRef, useState } from "react"

const useRefProps = () => {
  const [refProps, setRefProps] = useState({})
  const ref = useRef()

  useEffect(() => {
    setRefProps(ref.current)
  })

  return [ref, refProps]
}

export default useRefProps
