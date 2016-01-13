/* gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /gadkod.js - module entry point
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
 */

/* eslint-disable no-param-reassign, no-extend-native, no-loop-func */

import fs from "fs";
import readline from "readline";

let oCharacters = require( "../characters.json" ),
    _fParseLine, _fReport, _fConvert;

RegExp.prototype.execAll = function( sStr ) {
    let aMatch = null,
        aMatches = [];

    while ( aMatch = this.exec( sStr ) ) {
        aMatches.push( aMatch );
    }

    return !!aMatches.length && aMatches;
};

_fParseLine = function( sLine, iLineCount = 0 ) {
    let aExportedResults = [];

    for ( let sCharacter in oCharacters ) {
        let oInfos = oCharacters[ sCharacter ],
            aResults = ( new RegExp( `${ sCharacter }+`, "gi" ) ).execAll( sLine );

        if ( aResults ) {
            aResults.forEach( ( oResult ) => {
                aExportedResults.push( {
                    "line": iLineCount,
                    "column": oResult.index,
                    "character": {
                        "source": {
                            "char": sCharacter,
                            "name": oInfos.source.name
                        },
                        "replacement": oInfos.replacement
                    }
                } );
            } );
        }
    }

    return aExportedResults;
};

_fReport = function( sFilePath, fNext = null ) {
    let iLineCount = 0,
        aResults = [];

    readline
        .createInterface( {
            "input": fs.createReadStream( sFilePath )
        } )
        .on( "line", ( sLine ) => {
            Array.prototype.push.apply( aResults, _fParseLine( sLine, ++iLineCount ) );
        } )
        .on( "error", ( oError ) => {
            fNext && fNext( oError );
        } )
        .on( "close", () => {
            fNext && fNext( null, aResults );
        } );
};

_fConvert = function( sFilePath, oOptions, fNext = null ) {

    if ( oOptions instanceof Function && fNext == null ) {
        fNext = oOptions;
        oOptions = {};
    }

    _fReport( sFilePath, ( oError, aResults ) => {
        if ( oError ) {
            return fNext && fNext( oError );
        }

        fs.readFile( sFilePath, oOptions.encoding || "utf-8", ( oReadError, sFileContent ) => {
            if ( oReadError ) {
                return fNext && fNext( oReadError );
            }

            for ( let sCharacter in oCharacters ) {
                let oInfos = oCharacters[ sCharacter ];

                sFileContent = sFileContent.replace( new RegExp( `${ sCharacter }+`, "gi" ), oInfos.replacement.character );
            }

            fs.writeFile( sFilePath, sFileContent, oOptions.encoding, ( oWriteError ) => {
                if ( oWriteError ) {
                    return fNext && fNext( oWriteError );
                }
                return fNext && fNext( null, aResults );
            } );
        } );
    } );
};

export {
    _fParseLine as parseLine,
    _fReport as report,
    _fConvert as convert
};
