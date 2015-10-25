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
var aFilePaths, bConvert, chalk, error, gadkod, i, len, lodash, pkg, program, ref, ref1, sEncoding, sFilePath;

pkg = require("../package.json");

chalk = require("chalk");

lodash = require("lodash");

gadkod = require("./gadkod");

error = chalk.bold.red;

(program = require("commander")).version(pkg.version).usage("[options] <files…>").description("Check inside your files for problematic unicode characters in code (like greek question mark…)").option("-c, --convert", "perform a conversion for each suspicious character.").option("-e, --encoding [value]", "precise an encoding for the conversion (utf-8 by default).").parse(process.argv);

bConvert = program.convert;

sEncoding = (ref = program.encoding) != null ? ref : "utf-8";

if (program.args.length === 0) {
  console.log(error("✘ no file to analyze!"));
  process.exit(1);
}

aFilePaths = [];

ref1 = program.args;
for (i = 0, len = ref1.length; i < len; i++) {
  sFilePath = ref1[i];
  aFilePaths.push((require("glob")).sync(sFilePath));
}

aFilePaths = lodash.map(lodash.flatten(aFilePaths, true), function(s) {
  return (require("path")).resolve(process.cwd(), "./" + s);
});

aFilePaths.forEach(function(sFilePath) {
  var oOptions;
  if (bConvert) {
    oOptions = {
      encoding: sEncoding
    };
    return gadkod.convert(sFilePath, oOptions, function(oError, aResults) {
      if (aResults == null) {
        aResults = [];
      }
      if (oError) {
        return console.log(error("✘ error in " + (chalk.yellow(sFilePath)) + ": " + oError.message));
      }
      if (!aResults.length) {
        return console.log(chalk.green("✔ File " + (chalk.yellow(sFilePath)) + " is clean."));
      }
      console.log(chalk.green("✔ Converting " + aResults.length + " suspicious character" + (aResults.length > 1 ? "s" : "")), "found in " + (chalk.yellow(sFilePath)) + ":");
      aResults.forEach(function(oResult) {
        return console.log("  ◦ line " + (chalk.cyan(oResult.line)) + ", column " + (chalk.cyan(oResult.column + 1)) + ": found a " + (chalk.blue(oResult.character.source.name.toLowerCase())) + ", replaced by a " + (chalk.blue(oResult.character.replacement.name.toLowerCase())) + " (" + oResult.character.replacement.character + ").");
      });
      return console.log("");
    });
  } else {
    return gadkod.report(sFilePath, function(oError, aResults) {
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
  }
});
