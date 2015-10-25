###
 * gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /gadkod.js - module entry point
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
###

"use strict"

fs = require "fs"

oCharacters = require "../characters.json"

require "./regextend.js"

exports.parseLine = _parseLine = ( sLine, iLineCount = 0 ) ->
    aExportedResults = []
    for sCharacter, oInfos of oCharacters when aResults = ( new RegExp "#{ sCharacter }+", "gi" ).execAll sLine
        aResults.forEach ( oResult ) ->
            aExportedResults.push
                line: iLineCount
                column: oResult.index
                character:
                    source:
                        char: sCharacter
                        name: oInfos.source.name
                    replacement: oInfos.replacement
    aExportedResults

exports.report = _report = ( sFilePath, fNext = null ) ->

    iLineCount = 0
    aResults = []

    ( require "readline" )
        .createInterface
            input: fs.createReadStream sFilePath
        .on "line", ( sLine ) ->
            Array.prototype.push.apply aResults, ( _parseLine sLine, ++iLineCount )
        .on "error", ( oError ) ->
            fNext? oError
        .on "close", ->
            console.log aResults
            fNext? null, aResults

exports.convert = _convert = ( sFilePath, oOptions, fNext = null ) ->

    if oOptions instanceof Function and fNext is null
        fNext = oOptions
        oOptions = {}

    _report sFilePath, ( oError, aResults ) ->
        return fNext? oError if oError
        fs.readFile sFilePath, oOptions.encoding ? "utf-8", ( oError, sFileContent ) ->
            return fNext? oError if oError
            for sCharacter, oInfos of oCharacters
                sFileContent = sFileContent.replace ( new RegExp "#{ sCharacter }+", "gi" ), oInfos.replacement.character
            fs.writeFile sFilePath, sFileContent, { encoding: oOptions.encoding }, ( oError ) ->
                return fNext? oError if oError
                fNext? oError, aResults
