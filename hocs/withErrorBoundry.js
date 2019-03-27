import React from "react"
import TranslatedMessage from "app/commonComponents/TranslatedMessage/TranslatedMessage"

const ErrorBoundryMessage = ({ error, info }) => (
  <h2>
    <TranslatedMessage
      id="general.defaultErrorMessage"
      defaultMessage="Something went wrong."
    />
  </h2>
)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    this.setState({ error, info })
  }

  render() {
    const { error, info } = this.state

    if (error) {
      const Error = this.props.ErrorComponent || ErrorBoundryMessage
      return <Error error={error} info={info} />
    }

    return this.props.children
  }
}

export const withErrorBoundry = ErrorComponent => BaseComponent => props => (
  <ErrorBoundary ErrorComponent={ErrorComponent}>
    <BaseComponent {...props} />
  </ErrorBoundary>
)
