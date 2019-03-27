import { runIfExists } from "helpers/helpers"
import React from "react"
import { lifecycle } from "recompose"
import _ from "lodash"

export const withEffect = (
  callback,
  updateOnPropsChange = [],
  { onDidMount = true, compareManually } = {}
) => {
  let callbackReturnedFunction
  return lifecycle({
    componentDidMount() {
      if (onDidMount) {
        callbackReturnedFunction = callback(this.props)
      }
    },
    componentDidUpdate(prevProps) {
      if (compareManually) {
        if (compareManually(prevProps, this.props)) {
          callbackReturnedFunction = callback(this.props)
        }
      } else {
        updateOnPropsChange.forEach(prop => {
          if (!_.isEqual(_.get(prevProps, prop), _.get(this.props, prop))) {
            callbackReturnedFunction = callback(this.props)
          }
        })
      }
    },
    componentWillUnmount() {
      runIfExists(callbackReturnedFunction)
    }
  })
}
