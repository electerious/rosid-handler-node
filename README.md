# rosid-handler-node

[![Travis Build Status](https://travis-ci.org/electerious/rosid-handler-node.svg?branch=master)](https://travis-ci.org/electerious/rosid-handler-node) [![Coverage Status](https://coveralls.io/repos/github/electerious/rosid-handler-node/badge.svg?branch=master)](https://coveralls.io/github/electerious/rosid-handler-node?branch=master) [![Dependencies](https://david-dm.org/electerious/rosid-handler-node.svg)](https://david-dm.org/electerious/rosid-handler-node#info=dependencies)

A function that loads a JS file and transforms it to HTML by executing the exported default function.

## Install

```
npm install rosid-handler-node
```

## Usage

```js
const node = require('rosid-handler-node')

node('/src/index.js', '/src', '/dist', {}).then(({ data, savePath }) => {})
node('/src/index.html', '/src', '/dist', {}).then(({ data, savePath }) => {})
```

## Parameters

- `filePath` `{String}` Absolute path to the requested file.
- `srcPath` `{String}` Absolute path to the source folder.
- `distPath` `{?String}` Absolute path to the export folder.
- `route` `{Object}` The route which matched the request URL.

## Returns

- `{Promise}({Object})`
	- `data` `{String | Buffer}` The transformed file content.
	- `savePath` `{?String}` Where to save the file when compiling.