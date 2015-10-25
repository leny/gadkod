###
 * gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
###

"use strict"

pkg = require "../package.json"

chalk = require "chalk"
lodash = require "lodash"
gadkod = require "./gadkod"
error = chalk.bold.red

( program = require "commander" )
    .version pkg.version
    .usage "[options] <files…>"
    .description "Check inside your files for problematic unicode characters in code (like greek question mark…)"
    .option "-c, --convert", "perform a conversion for each suspicious character."
    .option "-e, --encoding [value]", "precise an encoding for the conversion (utf-8 by default)."
    .parse process.argv

# --- get options

bConvert = program.convert
sEncoding = program.encoding ? "utf-8"

# --- get paths

if program.args.length is 0
    console.log error "✘ no file to analyze!"
    process.exit 1

aFilePaths = []
aFilePaths.push ( require "glob" ).sync sFilePath for sFilePath in program.args
aFilePaths = lodash.map ( lodash.flatten aFilePaths, yes ), ( s ) -> ( require "path" ).resolve process.cwd(), "./#{ s }"

aFilePaths.forEach ( sFilePath ) ->
    if bConvert
        oOptions =
            encoding: sEncoding
        gadkod.convert sFilePath, oOptions, ( oError, aResults = [] ) ->
            return console.log error "✘ error in #{ chalk.yellow sFilePath }: #{ oError.message }" if oError
            return console.log chalk.green "✔ File #{ chalk.yellow sFilePath } is clean." unless aResults.length

            console.log ( chalk.green "✔ Converting #{ aResults.length } suspicious character#{ if aResults.length > 1 then "s" else "" }" ), "found in #{ chalk.yellow sFilePath }:"

            aResults.forEach ( oResult ) ->
                console.log "  ◦ line #{ chalk.cyan oResult.line }, column #{ chalk.cyan oResult.column + 1 }: found a #{ chalk.blue oResult.character.source.name.toLowerCase() }, replaced by a #{ chalk.blue oResult.character.replacement.name.toLowerCase() } (#{ oResult.character.replacement.character })."

            console.log ""
    else
        gadkod.report sFilePath, ( oError, aResults = [] ) ->
            return console.log error "✘ error in #{ chalk.yellow sFilePath }: #{ oError.message }" if oError
            return console.log chalk.green "✔ File #{ chalk.yellow sFilePath } is clean." unless aResults.length

            console.log ( chalk.red "⚠ #{ aResults.length } suspicious character#{ if aResults.length > 1 then "s" else "" }" ), "found in #{ chalk.yellow sFilePath }:"

            aResults.forEach ( oResult ) ->
                console.log "  ◦ line #{ chalk.cyan oResult.line }, column #{ chalk.cyan oResult.column + 1 }: found a #{ chalk.blue oResult.character.source.name.toLowerCase() }, should probably be a #{ chalk.blue oResult.character.replacement.name.toLowerCase() } (#{ oResult.character.replacement.character })."

            console.log ""
