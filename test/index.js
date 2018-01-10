'use strict'

const assert = require('chai').assert
const uuid = require('uuid/v4')
const index = require('./../src/index')

// Files must be in cwd so babel can load the plugins and presents
const fsify = require('fsify')({
	persistent: false
})

describe('index()', function() {

	it('should return an error when called without a filePath', async function() {

		return index().then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `'filePath' must be a string`)

		})

	})

	it('should return an error when called with invalid options', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`
			}
		])

		index(structure[0].name, '').then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, `'opts' must be undefined, null or an object`)

		})

	})

	it('should return an error when called with a fictive filePath', async function() {

		return index(`${ uuid() }.js`).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should return an error when JS passes an error to the callback', async function() {

		const input = uuid()

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: `module.exports = (next) => next(new Error('${ input }'))`
			}
		])

		return index(structure[0].name).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.strictEqual(err.message, input)

		})

	})

	it('should return an error when JS contains errors but everything is specified', async function() {

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: `module.exports = (next) =>`
			}
		])

		return index(structure[0].name).then(() => {

			throw new Error('Returned without error')

		}, (err) => {

			assert.isNotNull(err)
			assert.isDefined(err)

		})

	})

	it('should load callback JS and transform it to HTML when everything specified', async function() {

		const input = uuid()

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: `module.exports = (next) => next(null, '${ input }')`
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, input)

	})

	it('should load async JS and transform it to HTML when everything specified', async function() {

		const input = uuid()

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents: `module.exports = async () => '${ input }'`
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, input)

	})

	it('should load JS with JSX and transform it to HTML when everything specified', async function() {

		const input = `<p>${ uuid() }</p>`

		const contents = `
			const React = require('react')
			const renderToStaticMarkup = require('react-dom/server').renderToStaticMarkup
			const html = renderToStaticMarkup(${ input })
			module.exports = (next) => next(null, html)
		`

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, input)

	})

	it('should load JS with ES2015 syntax and transform it to HTML when everything specified', async function() {

		const input = `<p>${ uuid() }</p>`

		const contents = `
			import React from 'react'
			import { renderToStaticMarkup } from 'react-dom/server'
			const html = renderToStaticMarkup(${ input })
			export default (next) => next(null, html)
		`

		const structure = await fsify([
			{
				type: fsify.FILE,
				name: `${ uuid() }.js`,
				contents
			}
		])

		const result = await index(structure[0].name)

		assert.strictEqual(result, input)

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