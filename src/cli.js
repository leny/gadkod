/* gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
 */

/* eslint-disable no-console */

import chalk from "chalk";
import lodash from "lodash";
import program from "commander";
import glob from "glob";
import path from "path";
import * as gadkod from "./gadkod";

let pkg = require( "../package.json" ),
    error = chalk.bold.red,
    bConvert, sEncoding, aFilePaths;

program
    .version( pkg.version )
    .usage( "[options] <files…>" )
    .description( "Check inside your files for problematic unicode characters in code (like greek question mark…)" )
    .option( "-c, --convert", "perform a conversion for each suspicious character." )
    .option( "-e, --encoding [value]", "precise an encoding for the conversion (utf-8 by default)." )
    .parse( process.argv );

// --- get options

bConvert = program.convert;
sEncoding = program.encoding || "utf-8";

// --- get paths

if ( program.args.length === 0 ) {
    console.log( error( "✘ no file to analyze!" ) );
    process.exit( 1 );
}

aFilePaths = [];
for ( let sFilePath of program.args ) {
    aFilePaths.push( glob.sync( sFilePath ) );
}
aFilePaths = lodash.map( lodash.flatten( aFilePaths, true ), ( s ) => {
    return path.resolve( process.cwd(), `./${ s }` );
} );

aFilePaths.forEach( ( sFilePath ) => {
    if ( bConvert ) {
        let oOptions = {
            "encoding": sEncoding
        };

        gadkod.convert( sFilePath, oOptions, ( oError, aResults = [] ) => {
            if ( oError ) {
                return console.log( error( `✘ error in ${ chalk.yellow( sFilePath ) }: ${ oError.message }` ) );
            }

            if ( !aResults.length ) {
                return console.log( chalk.green( `✔ File ${ chalk.yellow( sFilePath ) } is clean.` ) );
            }

            console.log( chalk.green( `✔ Converting ${ aResults.length } suspicious character${ aResults.length > 1 ? "s" : "" }` ), `found in ${ chalk.yellow( sFilePath ) }:` );

            aResults.forEach( ( oResult ) => {
                console.log( `  ◦ line ${ chalk.cyan( oResult.line ) }, column ${ chalk.cyan( oResult.column + 1 ) }: found a ${ chalk.blue( oResult.character.source.name.toLowerCase() ) }, replaced by a ${ chalk.blue( oResult.character.replacement.name.toLowerCase() ) } (${ oResult.character.replacement.character }).` );
            } );

            console.log( "" );
        } );
    } else {
        gadkod.report( sFilePath, ( oError, aResults = [] ) => {
            if ( oError ) {
                return console.log( error( `✘ error in ${ chalk.yellow( sFilePath ) }: ${ oError.message }` ) );
            }

            if ( !aResults.length ) {
                return console.log( chalk.green( `✔ File ${ chalk.yellow( sFilePath ) } is clean.` ) );
            }

            console.log( chalk.red( `⚠ ${ aResults.length } suspicious character${ aResults.length > 1 ? "s" : "" }` ), `found in ${ chalk.yellow( sFilePath ) }:` );

            aResults.forEach( ( oResult ) => {
                console.log( `  ◦ line ${ chalk.cyan( oResult.line ) }, column ${ chalk.cyan( oResult.column + 1 ) }: found a ${ chalk.blue( oResult.character.source.name.toLowerCase() ) }, replaced by a ${ chalk.blue( oResult.character.replacement.name.toLowerCase() ) } (${ oResult.character.replacement.character }).` );
            } );

            console.log( "" );
        } );
    }
} );
