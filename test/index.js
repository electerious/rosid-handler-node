'use strict'

const fs     = require('fs')
const path   = require('path')
const assert = require('chai').assert
const temp   = require('temp').track()
const uuid   = require('uuid/v4')
const index  = require('./../src/index')

const newFile = function(content, suffix) {

	// File must be in current dir so babel-register can load the plugins and presents
	const file = temp.openSync({
		dir    : __dirname,
		suffix : suffix
	})

	fs.writeFileSync(file.path, content)

	return file.path

}

describe('index()', function() {

	it('should return an error when called without a filePath', function() {

		return index().then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with invalid options', function() {

		const file = newFile(`module.exports = (next) => next(null, 'true')`, '.js')

		return index(file, '').then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when called with a fictive filePath', function() {

		return index('test.js').then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when JS passes an error to the callback', function() {

		const message = uuid()
		const file    = newFile(`module.exports = (next) => next(new Error('${ message }'))`, '.js')

		return index(file).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(message, err.message)

		})

	})

	it('should return an error when JS contains errors but everything is specified', function() {

		const file = newFile(`module.exports = (next) =>`, '.js')

		return index(file).then((data) => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load JS and transform it to HTML when everything specified', function() {

		const output = uuid()
		const file   = newFile(`module.exports = (next) => next(null, '${ output }')`, '.js')

		return index(file).then((data) => {

			assert.strictEqual(output, data)

		})

	})

	it('should load JS with JSX and transform it to HTML when everything specified', function() {

		const output = `<p>${ uuid() }</p>`

		const file = newFile(`
			const React = require('react')
			const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
			const html = renderToStaticMarkup(${ output })
			module.exports = (next) => next(null, html)
		`, '.js')

		return index(file).then((data) => {

			assert.strictEqual(output, data)

		})

	})

	it('should load JS with ES2015 syntax and transform it to HTML when everything specified', function() {

		const output = `<p>${ uuid() }</p>`

		const file = newFile(`
			import React from 'react'
			import { renderToStaticMarkup } from 'react-dom/server'
			const html = renderToStaticMarkup(${ output })
			export default (next) => next(null, html)
		`, '.js')

		return index(file).then((data) => {

			assert.strictEqual(output, data)

		})

	})

	describe('.in()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.in(), '.js')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.in(''), '.js')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.in({ in: '.jsx' }), '.jsx')

		})

	})

	describe('.out()', function() {

		it('should be a function', function() {

			assert.isFunction(index.in)

		})

		it('should return a default extension', function() {

			assert.strictEqual(index.out(), '.html')

		})

		it('should return a default extension when called with invalid options', function() {

			assert.strictEqual(index.out(''), '.html')

		})

		it('should return a custom extension when called with options', function() {

			assert.strictEqual(index.out({ out: '.xml' }), '.xml')

		})

	})

	describe('.cache', function() {

		it('should be an array', function() {

			assert.isArray(index.cache)

		})

	})

})