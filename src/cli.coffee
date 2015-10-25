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

path = require "path"
chalk = require "chalk"
glob = require "glob"
lodash = require "lodash"
gadkod = require "./gadkod"
error = chalk.bold.red

( program = require "commander" )
    .version pkg.version
    .usage "[options] <files…>"
    .description "Check inside your files for problematic unicode characters in code (like greek question mark…)"
    .parse process.argv

# --- get paths

if program.args.length is 0
    console.log error "✘ no file to analyze!"
    process.exit 1

aFilePaths = []
aFilePaths.push glob.sync sFilePath for sFilePath in program.args
aFilePaths = lodash.map ( lodash.flatten aFilePaths, yes ), ( s ) -> path.resolve process.cwd(), "./#{ s }"

aFilePaths.forEach ( sFilePath ) ->
    gadkod.report sFilePath, {}, ( oError, aResults = [] ) ->
        return console.log error "✘ error in #{ chalk.yellow sFilePath }: #{ oError.message }" if oError
        return console.log chalk.green "✔ File #{ chalk.yellow sFilePath } is clean." unless aResults.length

        console.log ( chalk.red "⚠ #{ aResults.length } suspicious character#{ if aResults.length > 1 then "s" else "" }" ), "found in #{ chalk.yellow sFilePath }:"

        aResults.forEach ( oResult ) ->
            console.log "  ◦ line #{ chalk.cyan oResult.line }, column #{ chalk.cyan oResult.column + 1 }: found a #{ chalk.blue oResult.character.source.name.toLowerCase() }, should probably be a #{ chalk.blue oResult.character.replacement.name.toLowerCase() } (#{ oResult.character.replacement.character })."

        console.log ""
