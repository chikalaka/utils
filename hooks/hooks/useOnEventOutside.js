import { useEffect, useRef } from "react"

const useOnEventOutside = (
  callback,
  { events = ["mousedown"], isActive = true }
) => {
  const ref = useRef()

  useEffect(() => {
    const listener = event => {
      // Do nothing if event was triggered at ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      callback(event)
    }

    if (isActive) {
      events.forEach(event => {
        document.addEventListener(event, listener)
      })
    }

    return () => {
      if (isActive) {
        events.forEach(event => {
          document.removeEventListener(event, listener)
        })
      }
    }
  }, [events, isActive])

  return ref
}

export default useOnEventOutside
