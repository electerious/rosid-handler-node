'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const index  = require('./../src/index')

const newFile = function(content) {

	// File must be in current dir so babel-register can load the plugins and presents
	const file = temp.openSync({
		dir    : __dirname,
		suffix : '.js'
	})

	fs.writeFileSync(file.path, content)

	return file

}

describe('index()', function() {

	it('should return an error when called with an invalid filePath', function() {

		return index(null, '/src', '/dist', null).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should return an error when called with a fictive filePath', function() {

		return index('test.scss', '/src', '/dist', null).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should return an error when JS contains errors but everything is specified', function() {

		const file = newFile(`module.exports = () =>`)

		return index(file.path, '/src', '/dist', null).then(({ data, savePath }) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)

		})

	})

	it('should load JS and transform it to HTML when everything specified', function() {

		const file = newFile(`module.exports = () => 'true'`)

		return index(file.path, '/src', '/dist', null).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, 'true')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	it('should load JS with JSX and transform it to HTML when everything specified', function() {

		const file = newFile(`
			const React = require('react')
			const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
			module.exports = () => renderToStaticMarkup(<p>true</p>)
		`)

		return index(file.path, '/src', '/dist', null).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, '<p>true</p>')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	it('should load JS with ES2015 syntax and transform it to HTML when everything specified', function() {

		const file = newFile(`
			import React from 'react'
			import { renderToStaticMarkup } from 'react-dom/server'
			export default () => renderToStaticMarkup(<p>true</p>)
		`)

		return index(file.path, '/src', '/dist', null).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, '<p>true</p>')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	it('should load JS and transform it to HTML when distPath not specified', function() {

		const file = newFile(`module.exports = () => 'true'`)

		return index(file.path, '/src', null, null).then(({ data, savePath }) => {

			assert.isString(savePath)
			assert.strictEqual(data, 'true')
			assert.strictEqual(savePath.substr(-5), '.html')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

})