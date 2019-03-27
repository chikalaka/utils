import React from "react"
import TextEllipsis from "./TextEllipsis"
import { storiesOf } from "helpers/storybook/stories.helpers"
import { getKnobs } from "helpers/storybook/knobs.helpers"

storiesOf("TextEllipsis", module).add("all props", () => {
  const defaultValues = {
    text:
      "sdlafk salk jlv ksadj vlksjakldj lkdsvj lsdkv jlksa vjlakd vjalkd vjlk v lk",
    maxChars: 30
  }
  const knobs = getKnobs(TextEllipsis.propTypes, defaultValues)
  return <TextEllipsis {...knobs} />
})
