import React from "react"
import { storiesOf } from "@storybook/react"
import TranslatedMessage from "./TranslatedMessage"
import { withStories } from "helpers/storybook/stories.helpers"

const Custom = ({ children, className, ...props }) => (
  <div className={className}>
    this is custom component with children: {children}
  </div>
)

storiesOf("TranslatedMessage", module)
  .add("simple", withStories(() => <TranslatedMessage id="general.search" />))
  .add(
    "with className",
    withStories(() => (
      <TranslatedMessage id="general.search" className="font-size-22" />
    ))
  )
  .add(
    "element=none",
    withStories(() => <TranslatedMessage id="general.search" element="none" />)
  )
  .add(
    "element=Custom",
    withStories(() => (
      <TranslatedMessage
        id="general.search"
        element={Custom}
        className="font-size-22"
      />
    ))
  )
  .add(
    "render by children function",
    withStories(() => (
      <TranslatedMessage id="general.search" element={Custom}>
        {text => (
          <div>we are ignoring the element=Custom and getting: {text}</div>
        )}
      </TranslatedMessage>
    ))
  )
