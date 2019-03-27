import React from "react"
import ReactDOM from "react-dom"
import { runIfExists } from "helpers/helpers"

const withClickOutside = ({
  onClickOutside,
  eventName = "click",
  onMount = true
}) => BaseComponent => {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props)
      this.onClickOutside = this.onClickOutside.bind(this)
      this.addEventListener = this.addEventListener.bind(this)
      this.removeEventListener = this.removeEventListener.bind(this)
      this.state = { isListenerActive: false }
    }

    onClickOutside = event => {
      const DOMNode = ReactDOM.findDOMNode(this)
      if (!DOMNode.contains(event.target)) {
        runIfExists(onClickOutside, this.props)
      }
    }

    addEventListener = () => {
      if (this.state.isListenerActive) return
      document.addEventListener(eventName, this.onClickOutside)
      this.setState(state => ({ ...state, isListenerActive: true }))
    }

    removeEventListener = () => {
      document.removeEventListener(eventName, this.onClickOutside)
      this.setState(state => ({ ...state, isListenerActive: false }))
    }

    componentDidMount() {
      if (onMount) this.addEventListener()
    }

    componentWillUnmount() {
      this.removeEventListener()
    }

    componentDidUpdate(prevProps) {
      if (!prevProps.isListenerActive && this.props.isListenerActive) {
        this.addEventListener()
      } else if (prevProps.isListenerActive && !this.props.isListenerActive) {
        this.removeEventListener()
      }
    }

    render() {
      return <BaseComponent {...this.props} />
    }
  }

  return WrappedComponent
}

export default withClickOutside
