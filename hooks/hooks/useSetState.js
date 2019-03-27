import React, { useReducer } from "react"

const useSetState = initialState =>
  useReducer((state, newState) => ({ ...state, ...newState }), initialState)

export default useSetState
