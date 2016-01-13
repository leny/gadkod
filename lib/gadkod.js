"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.convert = exports.report = exports.parseLine = undefined;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _readline = require("readline");

var _readline2 = _interopRequireDefault(_readline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /gadkod.js - module entry point
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
 */

/* eslint-disable no-param-reassign, no-extend-native, no-loop-func */

var oCharacters = require("../characters.json"),
    _fParseLine = undefined,
    _fReport = undefined,
    _fConvert = undefined;

RegExp.prototype.execAll = function (sStr) {
    var aMatch = null,
        aMatches = [];

    while (aMatch = this.exec(sStr)) {
        aMatches.push(aMatch);
    }

    return !!aMatches.length && aMatches;
};

exports.parseLine = _fParseLine = function _fParseLine(sLine) {
    var iLineCount = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

    var aExportedResults = [];

    var _loop = function _loop(sCharacter) {
        var oInfos = oCharacters[sCharacter],
            aResults = new RegExp(sCharacter + "+", "gi").execAll(sLine);

        if (aResults) {
            aResults.forEach(function (oResult) {
                aExportedResults.push({
                    "line": iLineCount,
                    "column": oResult.index,
                    "character": {
                        "source": {
                            "char": sCharacter,
                            "name": oInfos.source.name
                        },
                        "replacement": oInfos.replacement
                    }
                });
            });
        }
    };

    for (var sCharacter in oCharacters) {
        _loop(sCharacter);
    }

    return aExportedResults;
};

exports.report = _fReport = function _fReport(sFilePath) {
    var fNext = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    var iLineCount = 0,
        aResults = [];

    _readline2.default.createInterface({
        "input": _fs2.default.createReadStream(sFilePath)
    }).on("line", function (sLine) {
        Array.prototype.push.apply(aResults, _fParseLine(sLine, ++iLineCount));
    }).on("error", function (oError) {
        fNext && fNext(oError);
    }).on("close", function () {
        fNext && fNext(null, aResults);
    });
};

exports.convert = _fConvert = function _fConvert(sFilePath, oOptions) {
    var fNext = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

    if (oOptions instanceof Function && fNext == null) {
        fNext = oOptions;
        oOptions = {};
    }

    _fReport(sFilePath, function (oError, aResults) {
        if (oError) {
            return fNext && fNext(oError);
        }

        _fs2.default.readFile(sFilePath, oOptions.encoding || "utf-8", function (oReadError, sFileContent) {
            if (oReadError) {
                return fNext && fNext(oReadError);
            }

            for (var sCharacter in oCharacters) {
                var _oInfos = oCharacters[sCharacter];

                sFileContent = sFileContent.replace(new RegExp(sCharacter + "+", "gi"), _oInfos.replacement.character);
            }

            _fs2.default.writeFile(sFilePath, sFileContent, oOptions.encoding, function (oWriteError) {
                if (oWriteError) {
                    return fNext && fNext(oWriteError);
                }
                return fNext && fNext(null, aResults);
            });
        });
    });
};

exports.parseLine = _fParseLine;
exports.report = _fReport;
exports.convert = _fConvert;
