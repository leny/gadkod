
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
var _convert, _report, fs, oCharacters;

fs = require("fs");

oCharacters = require("../characters.json");

exports.report = _report = function(sFilePath, fNext) {
  var aResults, iLineCount;
  if (fNext == null) {
    fNext = null;
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

exports.convert = _convert = function(sFilePath, oOptions, fNext) {
  if (fNext == null) {
    fNext = null;
  }
  if (oOptions instanceof Function && fNext === null) {
    fNext = oOptions;
    oOptions = {};
  }
  return _report(sFilePath, function(oError, aResults) {
    var ref;
    if (oError) {
      return typeof fNext === "function" ? fNext(oError) : void 0;
    }
    return fs.readFile(sFilePath, (ref = oOptions.encoding) != null ? ref : "utf-8", function(oError, sFileContent) {
      var oInfos, sCharacter;
      if (oError) {
        return typeof fNext === "function" ? fNext(oError) : void 0;
      }
      for (sCharacter in oCharacters) {
        oInfos = oCharacters[sCharacter];
        sFileContent = sFileContent.replace(new RegExp(sCharacter + "+", "gi"), oInfos.replacement.character);
      }
      return fs.writeFile(sFilePath, sFileContent, {
        encoding: oOptions.encoding
      }, function(oError) {
        if (oError) {
          return typeof fNext === "function" ? fNext(oError) : void 0;
        }
        return typeof fNext === "function" ? fNext(oError, aResults) : void 0;
      });
    });
  });
};
