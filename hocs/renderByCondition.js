import {
  branch,
  compose,
  lifecycle,
  mapProps,
  renderComponent,
  renderNothing,
  withProps,
  withState,
  withStateHandlers
} from "recompose"

const renderByCondition = (condition, left, right) =>
  branch(
    condition,
    (left && renderComponent(left)) || renderNothing,
    right && renderComponent(right)
  )

export default renderByCondition