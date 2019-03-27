/* eslint-disable import/no-extraneous-dependencies */
import initStoryshots from "@storybook/addon-storyshots"
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer"

const ignoreComponents = ["Loader", "AnotherComponent"]

initStoryshots({
  suite: "Storyshots",
  storyKindRegex: new RegExp(`^((?!.*?^${ignoreComponents.join("|")}$).)*$`),
  test: imageSnapshot({
    storybookUrl: `http://${process.env.SB_URL || "localhost"}:9001`
  })
})
