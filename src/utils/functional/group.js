// Group array of objects together according to a specific key
// `key` can a string (the object key), an array (several object keys) or
// a function returning a string.
export const groupBy = function (array, key) {
  return array.reduce(groupByReducer.bind(undefined, key), {})
}

const groupByReducer = function (key, groups, obj) {
  const groupName = getGroupName(key, obj)
  const { [groupName]: currentGroup = [] } = groups
  const newGroup = [...currentGroup, obj]
  return { ...groups, [groupName]: newGroup }
}

const getGroupName = function (key, obj) {
  if (typeof key === 'function') {
    return key(obj)
  }

  if (Array.isArray(key)) {
    return key.map((name) => obj[name]).join(',')
  }

  return obj[key]
}

export const groupValuesBy = function (array, key) {
  const groups = groupBy(array, key)
  return Object.values(groups)
}
