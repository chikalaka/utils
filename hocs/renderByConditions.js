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

// example: renderByConditions(
//   [props => props.error, props => ErrorComponent],
//   [props => props.warning, props => WarningComponent],
//   [identity, props => DefaultComponent]
// )
const renderByConditions = (...conditions) =>
  compose(
    ...conditions.map(condition =>
      renderByCondition(condition[0], condition[1], condition[2])
    )
  )

export default renderByConditions