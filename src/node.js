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
module.exports = function(filePath) {

	return new Promise((resolve, reject) => {

		// Require module without caching it
		const main = requireUncached(filePath)

		// Use the default function when module has a `export default`
		const fn = typeof main.default==='function' ? main.default : main

		// Support both callback functions and async functions
		const response = fn((err, data) => {

			if (err!=null) return reject(err)

			resolve(data)

		})

		if (response instanceof Promise===true) resolve(response)

	})

}