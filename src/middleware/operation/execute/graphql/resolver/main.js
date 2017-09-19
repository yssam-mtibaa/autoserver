'use strict';

const { resolveRead } = require('./read');
const { resolveWrite } = require('./write');

const resolveActions = function ({ actions, nextLayer, mInput }) {
  return resolveRead({ actions, nextLayer, mInput });
};

module.exports = {
  resolveActions,
};
