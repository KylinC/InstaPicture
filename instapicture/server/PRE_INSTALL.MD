# `node-gyp` - Node.js native addon build tool

[![Travis CI](https://travis-ci.com/nodejs/node-gyp.svg?branch=master)](https://travis-ci.com/nodejs/node-gyp)
[![Build Status](https://github.com/nodejs/node-gyp/workflows/Python_tests/badge.svg)](https://github.com/nodejs/node-gyp/actions?workflow=Python_tests)

`node-gyp` is a cross-platform command-line tool written in Node.js for
compiling native addon modules for Node.js. It contains a fork of the
[gyp](https://gyp.gsrc.io) project that was previously used by the Chromium
team, extended to support the development of Node.js native addons.

Note that `node-gyp` is _not_ used to build Node.js itself.

Multiple target versions of Node.js are supported (i.e. `0.8`, ..., `4`, `5`, `6`,
etc.), regardless of what version of Node.js is actually installed on your system
(`node-gyp` downloads the necessary development files or headers for the target version).

## Features

 * The same build commands work on any of the supported platforms
 * Supports the targeting of different versions of Node.js

## Installation

You can install `node-gyp` using `npm`:

``` bash
$ npm install -g node-gyp
```

Depending on your operating system, you will need to install:

### On Unix

   * Python v2.7, v3.5, v3.6, v3.7, or v3.8
   * `make`
   * A proper C/C++ compiler toolchain, like [GCC](https://gcc.gnu.org)

### On macOS

   * Python v2.7, v3.5, v3.6, v3.7, or v3.8
   * [Xcode](https://developer.apple.com/xcode/download/)
     * You also need to install the `XCode Command Line Tools` by running `xcode-select --install`. Alternatively, if you already have the full Xcode installed, you can find them under the menu `Xcode -> Open Developer Tool -> More Developer Tools...`. This step will install `clang`, `clang++`, and `make`.
   * If your Mac has been _upgraded_ to macOS Catalina (10.15), please read [macOS_Catalina.md](macOS_Catalina.md).

### On Windows
In the Windows Command Prompt:
```bash
npm install --global node-gyp@latest
for /f "delims=" %P in ('npm prefix -g') do npm config set node_gyp "%P\node_modules\node-gyp\bin\node-gyp.js"`
```
### Configuring Python Dependency

`node-gyp` requires that you have installed a compatible version of Python, one of: v2.7, v3.5, v3.6,
v3.7, or v3.8. If you have multiple Python versions installed, you can identify which Python
version `node-gyp` should use in one of the following ways:

1. by setting the `--python` command-line option, e.g.:

``` bash
$ node-gyp <command> --python /path/to/executable/python
```

2. If `node-gyp` is called by way of `npm`, *and* you have multiple versions of
Python installed, then you can set `npm`'s 'python' config key to the appropriate
value:

``` bash
$ npm config set python /path/to/executable/python
```

3. If the `PYTHON` environment variable is set to the path of a Python executable,
then that version will be used, if it is a compatible version.

4. If the `NODE_GYP_FORCE_PYTHON` environment variable is set to the path of a
Python executable, it will be used instead of any of the other configured or
builtin Python search paths. If it's not a compatible version, no further
searching will be done.
