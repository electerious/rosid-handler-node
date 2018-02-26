'use strict'

const node = require('./node')

// Require files with Babel
require('babel-register')({
	plugins: [
		'transform-es2015-modules-commonjs',
		'syntax-object-rest-spread'
	],
	presets: [
		'react'
	]
})

/**
 * Load JS and transform to HTML.
 * @public
 * @param {String} filePath - Absolute path to file.
 * @param {?Object} opts - Options.
 * @returns {Promise<String>} HTML.
 */
module.exports = async function(filePath, opts) {

	if (typeof filePath!=='string') throw new Error(`'filePath' must be a string`)
	if (typeof opts!=='object' && opts!=null) throw new Error(`'opts' must be undefined, null or an object`)

	return node(filePath)

}

/**
 * Tell Rosid with which file extension it should load the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.in = function(opts) {

	return (opts!=null && opts.in!=null) ? opts.in : '.js'

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} opts - Options.
 * @returns {String} File extension.
 */
module.exports.out = function(opts) {

	return (opts!=null && opts.out!=null) ? opts.out : '.html'

}

/**
 * Attach an array to the function, which contains a list of
 * file patterns used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'**/*.js',
	'**/*.json'
]