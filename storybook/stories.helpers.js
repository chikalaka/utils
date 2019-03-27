/* eslint-disable import/no-extraneous-dependencies */
import React from "react"
import { flatten } from "flat"
import { IntlProvider } from "react-intl"
import { translation } from "../../translations/en"
import { BrowserRouter } from "react-router-dom"
import { storiesOf } from "@storybook/react"

export const withStories = BaseComponent => props => (
  <IntlProvider locale={"en"} messages={flatten(translation)}>
    <BrowserRouter>
      <BaseComponent {...props} />
    </BrowserRouter>
  </IntlProvider>
)

const customStoriesOf = (...args) => {
  const main = storiesOf(...args)
  const add = main.add

  main.add = (title, component, ...addArgs) =>
    add(
      title,
      (...componentArgs) => {
        let newDiv = document.createElement("div")
        newDiv.id = "root-portal"
        document.body.appendChild(newDiv)
        return withStories(component)(...componentArgs)
      },
      ...addArgs
    )

  main.tags = (tags = []) => {
    const title = "Tags: " + tags.map(tag => "@" + tag).join(" ")
    return add(title, () => <div />)
  }
  return main
}

export const STORIES = {
  MAP_ICONS: "Map icons",
  FILTERS: "Filters"
}

export * from "@storybook/react"
export { customStoriesOf as storiesOf }
