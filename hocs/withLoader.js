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

const withLoader = (component, getLoadingProp) =>
  renderByCondition(
    props => (getLoadingProp ? getLoadingProp(props) : props.loading),
    component || Loader
  )

export default withLoader