'use strict'

/*
 * Execute JS and return the result.
 * @public
 * @param {String} filePath - Path to the JS file.
 */
module.exports = function(filePath) {

	// Force a fresh require by removing module from cache
	delete require.cache[filePath]

	// Require module and execute it directly or its default function when using `export default`
	const main   = require(filePath)
	const result = typeof main.default==='function' ? main.default() : main()

	return Promise.resolve(result)

}