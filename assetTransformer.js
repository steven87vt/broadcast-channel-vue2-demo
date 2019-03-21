/**
 * jest runs on node, node does not understand ES6 syntax. Use Require.
 *
 * This is used to map static assets to their filename (e.g. require(logo.png) to logo)
 * @see https://jestjs.io/docs/en/webpack#mocking-css-modules
 * @see https://github.com/facebook/jest/issues/2663#issuecomment-317109798
 */

const path = require('path')

module.exports = {
  process(src, filename, config, options) {
    return 'module.exports = ' + JSON.stringify(path.basename(filename)) + ';'
  }
}
