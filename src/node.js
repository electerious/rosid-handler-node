'use strict'

const decache = require('decache')
const pify    = require('pify')

/**
 * Execute JS and return the result.
 * @public
 * @param {String} filePath - Path to the JS file.
 * @returns {Promise} Returns the following properties if resolved: {String}.
 */
module.exports = function(filePath) {

	// Force a fresh require by removing module from cache,
	// including all of its child modules.
	decache(filePath)

	// Require module and use it directly or its default function when using `export default`
	const main = require(filePath)
	const fn   = typeof main.default==='function' ? main.default : main

	return pify(fn)()

}