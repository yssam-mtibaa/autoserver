import { throwError } from '../../../errors/main.js'
import { uniq } from '../../../utils/functional/uniq.js'

import { validateAllAttr } from './all.js'

// Validate that attributes in `args.select|data|order` are in the
// config.
// Also validate special key 'all'
// `args.cascade` is not validated because already previously checked.
export const validateUnknownAttrs = function ({ actions, config }) {
  actions.forEach((action) => validateAction({ action, config }))
}

const validateAction = function ({ action, config }) {
  validateAllAttr({ action, config })
  validateUnknown({ action, config })
}

// Validate that arguments's attributes are present in config
const validateUnknown = function ({ action, config }) {
  argsToValidate.forEach(({ name, getKeys }) => {
    const keys = getKeys({ action })
    validateUnknownArg({ keys, action, config, name })
  })
}

const getSelectKeys = function ({
  action: {
    args: { select = [] },
  },
}) {
  return select.filter((key) => key !== 'all')
}

const getRenameKeys = function ({
  action: {
    args: { rename = [] },
  },
}) {
  return rename.map(({ key }) => key)
}

// Turn e.g. [{ a, b }, { a }] into ['a', 'b']
const getDataKeys = function ({
  action: {
    args: { data = [] },
  },
}) {
  const keys = data.flatMap(Object.keys)
  const keysA = uniq(keys)
  return keysA
}

const getOrderKeys = function ({
  action: {
    args: { order = [] },
  },
}) {
  return order.map(({ attrName }) => attrName)
}

// Each argument type has its own way or specifying attributes
const argsToValidate = [
  { name: 'select', getKeys: getSelectKeys },
  { name: 'rename', getKeys: getRenameKeys },
  { name: 'data', getKeys: getDataKeys },
  { name: 'order', getKeys: getOrderKeys },
]

const validateUnknownArg = function ({
  keys,
  action: { commandpath, collname },
  config: { collections },
  name,
}) {
  const keyA = keys.find(
    (key) => collections[collname].attributes[key] === undefined,
  )

  if (keyA === undefined) {
    return
  }

  const path = [...commandpath, keyA].join('.')
  const message = `In '${name}' argument, attribute '${path}' is unknown`
  throwError(message, { reason: 'VALIDATION' })
}
