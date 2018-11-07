'use strict'

const continuousStealthyRequire = require('continuous-stealthy-require')

/**
 * Execute JS and return the result.
 * @public
 * @param {String} filePath - Path to the JS file.
 * @returns {Promise<String>} HTML.
 */
module.exports = function(filePath) {

	return new Promise((resolve, reject) => {

		// Require module without caching it
		const main = continuousStealthyRequire(filePath)

		// Use the default function when module has a `export default`
		const fn = typeof main.default === 'function' ? main.default : main

		// Support both callback functions and async functions
		const response = fn((err, data) => {

			if (err != null) return reject(err)

			resolve(data)

		})

		if (response instanceof Promise === true) resolve(response)

	})

}