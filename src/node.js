'use strict'

const util = require('util')
const stealthyRequire = require('stealthy-require')

/**
 * Requires a fresh, uncached module.
 * @param {String} filePath - File to require.
 * @returns {*} Required module.
 */
const requireUncached = function(filePath) {

	// Create a shallow copy of the array
	const initialChildren = module.children.slice()

	// Force a fresh require by removing module from cache,
	// including all of its child modules.
	const requiredModule = stealthyRequire(require.cache, () => require(filePath))

	// Reset children to avoid a memory leak when repeatedly requiring fresh modules
	module.children = initialChildren

	return requiredModule

}

/**
 * Execute JS and return the result.
 * @public
 * @param {String} filePath - Path to the JS file.
 * @returns {Promise<String>} HTML.
 */
module.exports = async function(filePath) {

	// Require module and use it directly or its default function when using `export default`
	const main = requireUncached(filePath)
	const fn = typeof main.default==='function' ? main.default : main

	return util.promisify(fn)()

}