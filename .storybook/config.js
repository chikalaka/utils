import { configure, addDecorator } from "@storybook/react"
import { withNotes } from "@storybook/addon-notes"
import { withKnobs } from "@storybook/addon-knobs"
import "index.css"
import "icons.css"
import "themes/theme.css"

addDecorator(withKnobs)
addDecorator(withNotes)

function loadStories() {
  // require("storybookPlayground/stories.js")
  // ...
}

// An attempt to load all stories dynamically
// const regexAllStories = new RegExp('./**/*.stories.js')
// const testRegex = "(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$"
// const req = require.context('../src/app', true, testRegex)
// const loadStories = () => req.keys().forEach(req)

configure(loadStories, module)
