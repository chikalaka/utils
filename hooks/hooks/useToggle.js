import React, { useState } from "react"

const useToggle = (initialData = false) => {
  const [toggled, setToggle] = useState(initialData)
  const toggleOn = () => setToggle(true)
  const toggleOff = () => setToggle(false)
  const toggle = () => setToggle(t => !t)
  return {
    toggleOn,
    toggleOff,
    toggle,
    setToggle,
    toggled
  }
}

export default useToggle
