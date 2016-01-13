# gadkòd

[![NPM version](http://img.shields.io/npm/v/gadkod.svg)](https://www.npmjs.org/package/gadkod) ![Dependency Status](https://david-dm.org/leny/gadkod.svg) ![Downloads counter](http://img.shields.io/npm/dm/gadkod.svg)

> Check inside your files for suspicious unicode characters in code (like greek question mark…)

* * *

## How it works ?

**gadkòd**, according to the options used, read the given files to find unicode characters that can create potential errors in code, like the greek question mark, unbreakable spaces, etc.  
By default, **gadkòd** will only report the characters, but he can also convert the characters if needed.

## Usage as node.js module

### Installation

To use **gadkòd** as a node.js module, install it first to your project.

    npm install --save gadkod

### Usage for reporting

Using **gadkòd** for reporting is simple, after require it :

    gadkod = require( "gadkod" );

    gadkod.report( "./code.js", function( oError, oResults ) {
        // do awesome things here.
    } );

#### Signature

    gadkod.report( sFilePath [, fCallback ] )

##### Arguments

- `sFilePath` is the path to the file to analyse.
- `fCallback` is the callback function, which returns two arguments :
    - `oError`: if an error occurs during the process
    - `aResults`: the report for the given files, which is an array of results, containing `line` & `column` of the character, and a `character` object describing the character and its probable replacement.

### Usage for converting

Using **gadkòd** for converting is simple, after require it :

    gadkod = require( "gadkod" );

    gadkod.convert( "./code.js", oOptions, function( oError, oResults ) {
        // do awesome things here.
    } );

#### Signature

    gadkod.convert( sFilePath [, oOptions [, fCallback ] ] )

##### Arguments

- `sFilePath` is the path to the file to convert.
- `oOptions` details the options for conversion.
    - `encoding`: use the specified encoding to read & write file. If no encoding is given, **gadkòd** will use `utf-8`.
- `fCallback` is the callback function, which returns two arguments :
    - `oError`: if an error occurs during the process
    - `aResults`: the report for the given files, which is an array of results, containing `line` & `column` of the character, and a `character` object describing the character and the affected replacement.

## Usage as *command-line tool*

### Installation

To use **gadkòd** as a command-line tool, it is preferable to install it globally.

    (sudo) npm install -g gadkod

### Usage

Using **gadkòd** is simple:

    gadkod [options] <files…>

    Options:

        -c, --convert          perform a conversion, replacing the suspicious characters
        -e, --encoding [value] when performing a conversion, use the specified encoding
        -h, --help             output usage information
        -V, --version          output the version number

#### Options

##### convert (`-c`,`--convert`)

By default, **gadkòd** only report the suspicious characters, without performing any conversion.  
With the `convert` option, each suspicious character will be replaced, and a rapport will be outputed to track the replacements.

##### encoding (`-e`,`--encoding [value]`)

When performing a conversion, use the specified encoding to read & write file. If no encoding is given, **gadkòd** will use `utf-8`.

##### help (`-h`,`--help`)

Output usage information.

##### version (`-v`,`--version`)

Output **gadkòd**' version number.

## Usage as [Atom](https://atom.io) [Linter](https://github.com/AtomLinter/Linter) package

Please refer to [linter-gadkod](https://atom.io/packages/linter-gadkod) documentation.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Lint your code using [Grunt](http://gruntjs.com/).

## Release History

* **0.2.0**: Rewrite code with ES2015 (*13/01/16*)
* **0.1.0**: Initial release (*25/10/15*)

## License
Copyright (c) 2015 Leny  
Licensed under the MIT license.
