'use strict'

const path = require('path')
const fs   = require('fs')
const node = require('./node')

// Only babel require files inside the current cwd which are not in `node_modules`
const cwd    = process.cwd()
const regexp = new RegExp('^' + cwd + '(?!\\' + path.sep + 'node_modules)')

// Babel require files matching regexp
require('babel-register')({
	only    : regexp,
	plugins : [ 'transform-es2015-modules-commonjs' ],
	presets : [ 'react' ]
})

/*
 * Load EJS and transform to HTML.
 * @public
 * @param {String} filePath - Absolute path to file.
 * @param {?Object} opts - Options.
 * @returns {Promise} Returns the following properties if resolved: {String}.
 */
module.exports = function(filePath, opts) {

	return Promise.resolve().then(() => {

		if (typeof filePath!=='string')           throw new Error(`'filePath' must be a string`)
		if (typeof opts!=='object' && opts!=null) throw new Error(`'opts' must be undefined, null or an object`)

	}).then(() => {

		return node(filePath)

	}).then((str) => {

		return str

	})

}

/**
 * Tell Rosid with which file extension it should load the file.
 * @public
 * @param {?Object} opts - Options.
 */
module.exports.in = function(opts) {

	return (opts!=null && opts.in!=null) ? opts.in : 'js'

}

/**
 * Tell Rosid with which file extension it should save the file.
 * @public
 * @param {?Object} opts - Options.
 */
module.exports.out = function(opts) {

	return (opts!=null && opts.out!=null) ? opts.out : 'html'

}

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 * @public
 */
module.exports.cache = [
	'.js',
	'.json'
]