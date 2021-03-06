import { GraphQLNonNull } from 'graphql'

// Returns whether a field is required
export const graphqlRequiredTest = function (def, opts) {
  return optionalTests.every((testFunc) => !testFunc(def, opts))
}

// Already wrapped in Required type
const isWrapped = function ({ requiredWrapped }) {
  return requiredWrapped
}

// `attr.validate.required` must be true
const isNotRequiredValidated = function ({ validate = {} }) {
  return !validate.required
}

// `args.filter` fields are never required
const isFilterArg = function (def, { inputObjectType }) {
  return inputObjectType === 'filter'
}

// `patchOne|patchMany` do not require any attribute in `args.data`
const isPatchArg = function ({ command }, { inputObjectType }) {
  return inputObjectType === 'data' && command === 'patch'
}

// `data.id` is optional in createOne|createMany
const isCreateId = function ({ command }, { defName, inputObjectType }) {
  return inputObjectType === 'data' && command === 'create' && defName === 'id'
}

const optionalTests = [
  isWrapped,
  isNotRequiredValidated,
  isFilterArg,
  isPatchArg,
  isCreateId,
]

// Required field TGetter
export const graphqlRequiredTGetter = function (def, opts) {
  const defA = { ...def, requiredWrapped: true }
  const subType = opts.getType(defA, opts)
  const type = new GraphQLNonNull(subType)
  return type
}
