# gadkòd

[![NPM version](http://img.shields.io/npm/v/gadkod.svg)](https://www.npmjs.org/package/gadkod) ![Dependency Status](https://david-dm.org/leny/gadkod.svg) ![Downloads counter](http://img.shields.io/npm/dm/gadkod.svg)

> Check inside your files for problematic unicode characters in code (like greek question mark…)

* * *

## How it works ?

**gadkòd**, according to the options used, read the given files to find unicode characters that can create potential errors in code, like the greek question mark, unbreakable spaces, etc.  
By default, **gadkòd** will only report the characters, but he can also convert the characters if needed.

## Usage as node.js module

### Installation

To use **gadkòd** as a node.js module, install it first to your project.

    npm install --save gadkod

### Usage

Using **gadkòd** is simple, after require it :

    gadkod = require( "gadkod" );

    gadkod( "./*.js", {}, function( oError, oResults ) {
        // do awesome things here.
    } );

### Signature

    gadkod( sFiles [, oOptions [, fCallback ] ] )

#### Arguments

- `sFiles` is the path to the files to analyse (can be a [glob](https://www.npmjs.com/package/glob)).
- `oOptions` is an object which can contain the following properties :
    - _TODO_
- `fCallback` is the callback function, which returns two arguments :
    - `oError`: if an error occurs during the process
    - `oResults`: the report for the given files

## Usage as *command-line tool*

### Installation

To use **gadkòd** as a command-line tool, it is preferable to install it globally.

    (sudo) npm install -g gadkod

### Usage

Using **gadkòd** is simple:

    gadkod [options] <files…>

    Options:

        -h, --help             output usage information
        -V, --version          output the version number

#### Options

##### help (`-h`,`--help`)

Output usage information.

##### version (`-v`,`--version`)

Output **gadkòd**' version number.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.1.0**: Initial release (*25/10/15*)

## License
Copyright (c) 2015 Leny  
Licensed under the MIT license.
