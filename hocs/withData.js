import { emptyFunc, runIfExists } from "helpers/helpers"
import { withEffect } from "helpers/hocs/withEffect"
import { compose, withState } from "recompose"

let isMounted = false

const withData = ({
  task,
  promiseCallBack,
  initialDataName,
  initialDataValue,
  setData = "setInitialData",
  loadingName = "loading",
  shouldRerunTask = emptyFunc,
  transformData,
  onDidMount = true,
  updateOnPropsChange = []
}) => {
  return compose(
    withState(initialDataName, setData, props =>
      onDidMount ? initialDataValue : props[initialDataName]
    ),
    withState(loadingName, "setLoading", onDidMount),
    withState("error", "setError", null),
    withEffect(
      props => {
        isMounted = true
        props.setLoading(true)
        executeTaskOrCallBack({
          promiseCallBack,
          task,
          loadingName,
          transformData,
          setData,
          props
        })
        return () => (isMounted = false)
      },
      updateOnPropsChange,
      { onDidMount, compareManually: shouldRerunTask }
    )
  )
}

const executeTaskOrCallBack = ({
  promiseCallBack,
  task,
  loadingName,
  transformData,
  setData,
  props
}) => {
  if (promiseCallBack) {
    promiseCallBack(props)
      .then(data => {
        if (isMounted) {
          const newData = transformData ? transformData(data) : data
          props[setData](newData)
          props.setLoading(false)
        }
      })
      .catch(error => {
        console.error("withData -", error)
        if (isMounted) {
          props.setLoading(false)
          props.setError(error && error.message)
        }
      })
  } else {
    runIfExists(task, props).fork(
      error => {
        console.error("withData -", error)
        if (isMounted) {
          props.setLoading(false)
          props.setError(error && error.message)
        }
      },
      data => {
        if (isMounted) {
          const newData = transformData ? transformData(data) : data
          props[setData](newData)
          props.setLoading(false)
        }
      }
    )
  }
}

export default withData
