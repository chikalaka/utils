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

const renderIf = condition => branch(condition, v => v, renderNothing)

export default renderIf