#!/usr/bin/env node
/*
 * gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
 */
"use strict";
var aFilePaths, chalk, error, gadkod, glob, i, len, lodash, path, pkg, program, ref, sFilePath;

pkg = require("../package.json");

path = require("path");

chalk = require("chalk");

glob = require("glob");

lodash = require("lodash");

gadkod = require("./gadkod");

error = chalk.bold.red;

(program = require("commander")).version(pkg.version).usage("[options] <files…>").description("Check inside your files for problematic unicode characters in code (like greek question mark…)").parse(process.argv);

if (program.args.length === 0) {
  console.log(error("✘ no file to analyze!"));
  process.exit(1);
}

aFilePaths = [];

ref = program.args;
for (i = 0, len = ref.length; i < len; i++) {
  sFilePath = ref[i];
  aFilePaths.push(glob.sync(sFilePath));
}

aFilePaths = lodash.map(lodash.flatten(aFilePaths, true), function(s) {
  return path.resolve(process.cwd(), "./" + s);
});

aFilePaths.forEach(function(sFilePath) {
  return gadkod.report(sFilePath, {}, function(oError, aResults) {
    if (aResults == null) {
      aResults = [];
    }
    if (oError) {
      return console.log(error("✘ error in " + (chalk.yellow(sFilePath)) + ": " + oError.message));
    }
    if (!aResults.length) {
      return console.log(chalk.green("✔ File " + (chalk.yellow(sFilePath)) + " is clean."));
    }
    console.log(chalk.red("⚠ " + aResults.length + " suspicious character" + (aResults.length > 1 ? "s" : "")), "found in " + (chalk.yellow(sFilePath)) + ":");
    aResults.forEach(function(oResult) {
      return console.log("  ◦ line " + (chalk.cyan(oResult.line)) + ", column " + (chalk.cyan(oResult.column + 1)) + ": found a " + (chalk.blue(oResult.character.source.name.toLowerCase())) + ", should probably be a " + (chalk.blue(oResult.character.replacement.name.toLowerCase())) + " (" + oResult.character.replacement.character + ").");
    });
    return console.log("");
  });
});
