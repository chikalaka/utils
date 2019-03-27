import React from "react"
import { FormattedMessage } from "react-intl"

const TranslatedMessage = ({
  id,
  values,
  defaultMessage,
  description,
  element = "span",
  children,
  ...props
}) => (
  <FormattedMessage {...{ id, values, defaultMessage, description }}>
    {text => {
      if (typeof children === "function") {
        return children(text)
      }
      if (element === "none") {
        return text
      }
      return React.createElement(element, props, text)
    }}
  </FormattedMessage>
)

export default TranslatedMessage
