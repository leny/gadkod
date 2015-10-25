
/*
 * gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /gadkod.js - module entry point
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
 */
"use strict";
var fs, oCharacters;

fs = require("fs");

oCharacters = require("../characters.json");

exports.report = function(sFilePath, oOptions, fNext) {
  var aResults, iLineCount;
  if (oOptions == null) {
    oOptions = {};
  }
  if (fNext == null) {
    fNext = null;
  }
  if (oOptions instanceof Function && fNext === null) {
    fNext = oOptions;
    oOptions = {};
  }
  iLineCount = 0;
  aResults = [];
  return (require("readline")).createInterface({
    input: fs.createReadStream(sFilePath)
  }).on("line", function(sLine) {
    var oInfos, oResults, results, sCharacter;
    ++iLineCount;
    results = [];
    for (sCharacter in oCharacters) {
      oInfos = oCharacters[sCharacter];
      if (oResults = (new RegExp(sCharacter + "+", "gi")).exec(sLine)) {
        results.push(aResults.push({
          line: iLineCount,
          column: oResults.index,
          character: {
            source: {
              char: sCharacter,
              name: oInfos.source.name
            },
            replacement: oInfos.replacement
          }
        }));
      }
    }
    return results;
  }).on("error", function(oError) {
    return typeof fNext === "function" ? fNext(oError) : void 0;
  }).on("close", function() {
    return typeof fNext === "function" ? fNext(null, aResults) : void 0;
  });
};
