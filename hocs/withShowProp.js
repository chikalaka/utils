import { renderIf } from "helpers/hocs/hocs"

export const withShowProp = renderIf(({ show = true }) => show)
