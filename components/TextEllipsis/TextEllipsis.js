import { renderIf } from "helpers/hocs/hocs"
import React from "react"
import PropTypes from "prop-types"
import { getClassName, trimStringByLength } from "helpers/helpers"

const TextEllipsis = renderIf(({ text }) => text)(
  ({ className, text, maxChars = 70 }) => (
    <div
      className={getClassName(className)}
      title={text.length > maxChars ? text : undefined}
    >
      {trimStringByLength(text, maxChars)}
    </div>
  )
)

TextEllipsis.propTypes = {
  text: PropTypes.string,
  maxChars: PropTypes.number,
  className: PropTypes.className
}

export default TextEllipsis
