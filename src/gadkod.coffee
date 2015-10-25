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

exports.report = ( sFilePath, oOptions = {}, fNext = null ) ->

    # parse arguments

    if oOptions instanceof Function and fNext is null
        fNext = oOptions
        oOptions = {}

    # get file content

    iLineCount = 0
    aResults = []

    ( require "readline" )
        .createInterface
            input: fs.createReadStream sFilePath
        .on "line", ( sLine ) ->
            ++iLineCount
            for sCharacter, oInfos of oCharacters when oResults = ( new RegExp "#{ sCharacter }+", "gi" ).exec sLine
                aResults.push
                    line: iLineCount
                    column: oResults.index
                    character:
                        source:
                            char: sCharacter
                            name: oInfos.source.name
                        replacement: oInfos.replacement
        .on "error", ( oError ) ->
            fNext? oError
        .on "close", ->
            fNext? null, aResults
