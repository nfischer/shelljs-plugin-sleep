# shelljs-plugin-sleep

[![Travis](https://img.shields.io/travis/nfischer/shelljs-plugin-sleep/master.svg?style=flat-square&label=unix)](https://travis-ci.org/nfischer/shelljs-plugin-sleep)
[![AppVeyor](https://img.shields.io/appveyor/ci/shelljs/shelljs-plugin-sleep/master.svg?style=flat-square&label=windows)](https://ci.appveyor.com/project/shelljs/shelljs-plugin-sleep/branch/master)
[![npm](https://img.shields.io/npm/v/shelljs-plugin-sleep.svg?style=flat-square)](https://www.npmjs.com/package/shelljs-plugin-sleep)
[![shelljs-plugin](https://img.shields.io/badge/shelljs-plugin-brightgreen.svg?style=flat-square)](https://github.com/shelljs/shelljs/wiki/Using-ShellJS-Plugins)

A [ShellJS](https://github.com/shelljs/shelljs) plugin for the `sleep()`
command.

## Installation

```bash
$ npm install --save shelljs
$ npm install --save shelljs-plugin-sleep
```

## Usage

To use this plugin in your project, include it like so:

```javascript
var shell = require('shelljs');
require('shelljs-plugin-sleep');

// Ex. usage:
shell.sleep(1); // the plugin is now available!
```

### sleep(seconds)

No available options.

Examples:

```javascript
shell.sleep(3); // sleep for 3000 milliseconds
```

## Supported systems

 - Linux (all variants)
 - OS X
 - Windows

This is only supported for Node v4+

## Writing plugins

If you're interested in taking a look at the current state of the plugin API,
take a look at [index.js](index.js). This has helpful comments explaining the
necessary boilerplate for writing a plugin. For an example usage of the plugin,
take a look at [test/test.js](test/test.js).
