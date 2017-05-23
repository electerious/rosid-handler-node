# rosid-handler-node

[![Travis Build Status](https://travis-ci.org/electerious/rosid-handler-node.svg?branch=master)](https://travis-ci.org/electerious/rosid-handler-node) [![AppVeyor Status](https://ci.appveyor.com/api/projects/status/hmuf0jr4pdjiandt?svg=true)](https://ci.appveyor.com/project/electerious/rosid-handler-node) [![Coverage Status](https://coveralls.io/repos/github/electerious/rosid-handler-node/badge.svg?branch=master)](https://coveralls.io/github/electerious/rosid-handler-node?branch=master) [![Dependencies](https://david-dm.org/electerious/rosid-handler-node.svg)](https://david-dm.org/electerious/rosid-handler-node#info=dependencies)

A function that loads a JS file and transforms it to HTML by executing the exported default function.

## Install

```
npm install rosid-handler-node
```

## Usage

### API

```js
const node = require('rosid-handler-node')

node('index.js').then((data) => {})
node('index.html').then((data) => {})
```

### Rosid

Add the following object to your `rosidfile.json`, `rosidfile.js` or [routes array](https://github.com/electerious/Rosid#routes). `rosid-handler-node` will execute all matching JS files in your source folder and save the output as static HTML.

```json
{
	"name"    : "Node",
	"path"    : "[^_]*.{html,js}*",
	"handler" : "rosid-handler-node"
}
```

```js
// index.js
export default (next) => next(null, '<h1>Hello World</h1>')
```

```html
<!-- index.html (output) -->
<h1>Hello World</h1>
```

## Parameters

- `filePath` `{String}` Absolute path to file.

## Returns

- `{Promise}({String|Buffer})` The transformed file content.