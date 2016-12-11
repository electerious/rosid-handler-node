'use strict'

const path   = require('path')
const fs     = require('fs')
const rename = require('rename-extension')
const node   = require('./node')

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
 * @param {String} filePath - Absolute path to the requested file.
 * @param {String} srcPath - Absolute path to the source folder.
 * @param {String} distPath - Absolute path to the export folder.
 * @param {Object} route - The route which matched the request URL.
 * @returns {Promise} Returns the following properties if resolved: {Object}.
 */
module.exports = function(filePath, srcPath, distPath, route) {

	let savePath = null
	let dataPath = null

	let data = null

	return Promise.resolve().then(() => {

		// Prepare file paths

		filePath = rename(filePath, 'js')
		savePath = rename(filePath.replace(srcPath, distPath), 'html')

	}).then(() => {

		// Process file

		return node(filePath)

	}).then((str) => {

		return {
			data     : str,
			savePath : savePath
		}

	})

}

/**
 * Attach an array to the function, which contains a list of
 * extensions used by the handler. The array will be used by Rosid for caching purposes.
 */
module.exports.cache = [
	'.js',
	'.json'
]