'use strict'

/*
 * Execute JS and return the result.
 * @public
 * @param {String} filePath - Path to the JS file.
 */
module.exports = function(filePath) {

	// Force a fresh require by removing module from cache
	delete require.cache[filePath]

	const result = require(filePath)()

	return Promise.resolve(result)

}