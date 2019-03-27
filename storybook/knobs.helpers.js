/* eslint-disable import/no-extraneous-dependencies */
import { action } from "@storybook/addon-actions"
import { getDataAsArray } from "helpers/helpers"
import PropTypes from "prop-types"
import React from "react"
import { select, boolean, text, number, color } from "@storybook/addon-knobs"

const customSelect = (label, options, defaultValue, ...args) => {
  const _defaultValue =
    Array.isArray(options) && !defaultValue ? options[0] : defaultValue
  return select(label, options, _defaultValue, ...args)
}

const customBoolean = (label, defaultValue, ...args) => {
  return boolean(label, !!defaultValue, ...args)
}

export const withClassName = ({
  title = "className",
  className,
  description,
  byDefault = false
}) => {
  const options = {
    [description]: className,
    "no class": ""
  }
  return select(title, options, byDefault ? value : "")
}

export const getKnobs = (propTypes, defaultValues = {}, props = {}) => {
  let knobs = {}
  Object.keys(propTypes).forEach(type => {
    if (type in props) return

    if (type === "onClick") {
      const withOnClick = boolean("with onClick", true)
      knobs.onClick = withOnClick ? action("onClick was triggered") : null
    }

    if (type.toLowerCase().includes("classname")) {
      const [value, byDefault = false] = getDataAsArray(defaultValues[type])
      const _withClassName =
        value && boolean(`${type} - ".${value}"`, byDefault)
      knobs[type] = _withClassName ? value : ""
    }

    if (type.toLowerCase().includes("color")) {
      knobs[type] = color(type, defaultValues[type])
    }

    if (propTypes[type] === PropTypes.bool)
      knobs[type] = boolean(type, defaultValues[type])

    if (propTypes[type] === PropTypes.number)
      knobs[type] = number(type, defaultValues[type])

    if (propTypes[type] === PropTypes.array) {
      const string = text(`${type} (Array)`)
      knobs[type] = string
        ? string.split(",").map(str => str.trim())
        : defaultValues[type]
    }

    if (propTypes[type] === PropTypes.object) {
      const string = text(`${type} (Object)`)
      try {
        knobs[type] = string ? JSON.parse(string) : defaultValues[type]
      } catch (e) {
        knobs[type] = string || defaultValues[type]
      }
    }

    if (!(type in knobs)) {
      knobs[type] = text(type, defaultValues[type])
    }
  })

  return { ...knobs, ...props }
}

export * from "@storybook/addon-knobs"
export { customSelect as select }
export { customBoolean as boolean }
