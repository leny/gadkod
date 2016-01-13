#!/usr/bin/env node"use strict";

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _commander = require("commander");

var _commander2 = _interopRequireDefault(_commander);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _gadkod = require("./gadkod");

var gadkod = _interopRequireWildcard(_gadkod);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* gadkòd
 * https://github.com/leny/gadkod
 *
 * JS/COFFEE Document - /cli.js - cli entry point, commander setup and runner
 *
 * Copyright (c) 2015 Leny
 * Licensed under the MIT license.
 */

/* eslint-disable no-console */

var pkg = require("../package.json"),
    error = _chalk2.default.bold.red,
    bConvert = undefined,
    sEncoding = undefined,
    aFilePaths = undefined;

_commander2.default.version(pkg.version).usage("[options] <files…>").description("Check inside your files for problematic unicode characters in code (like greek question mark…)").option("-c, --convert", "perform a conversion for each suspicious character.").option("-e, --encoding [value]", "precise an encoding for the conversion (utf-8 by default).").parse(process.argv);

// --- get options

bConvert = _commander2.default.convert;
sEncoding = _commander2.default.encoding || "utf-8";

// --- get paths

if (_commander2.default.args.length === 0) {
    console.log(error("✘ no file to analyze!"));
    process.exit(1);
}

aFilePaths = [];
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = _commander2.default.args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var sFilePath = _step.value;

        aFilePaths.push(_glob2.default.sync(sFilePath));
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}

aFilePaths = _lodash2.default.map(_lodash2.default.flatten(aFilePaths, true), function (s) {
    return _path2.default.resolve(process.cwd(), "./" + s);
});

aFilePaths.forEach(function (sFilePath) {
    if (bConvert) {
        var oOptions = {
            "encoding": sEncoding
        };

        gadkod.convert(sFilePath, oOptions, function (oError) {
            var aResults = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            if (oError) {
                return console.log(error("✘ error in " + _chalk2.default.yellow(sFilePath) + ": " + oError.message));
            }

            if (!aResults.length) {
                return console.log(_chalk2.default.green("✔ File " + _chalk2.default.yellow(sFilePath) + " is clean."));
            }

            console.log(_chalk2.default.green("✔ Converting " + aResults.length + " suspicious character" + (aResults.length > 1 ? "s" : "")), "found in " + _chalk2.default.yellow(sFilePath) + ":");

            aResults.forEach(function (oResult) {
                console.log("  ◦ line " + _chalk2.default.cyan(oResult.line) + ", column " + _chalk2.default.cyan(oResult.column + 1) + ": found a " + _chalk2.default.blue(oResult.character.source.name.toLowerCase()) + ", replaced by a " + _chalk2.default.blue(oResult.character.replacement.name.toLowerCase()) + " (" + oResult.character.replacement.character + ").");
            });

            console.log("");
        });
    } else {
        gadkod.report(sFilePath, function (oError) {
            var aResults = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            if (oError) {
                return console.log(error("✘ error in " + _chalk2.default.yellow(sFilePath) + ": " + oError.message));
            }

            if (!aResults.length) {
                return console.log(_chalk2.default.green("✔ File " + _chalk2.default.yellow(sFilePath) + " is clean."));
            }

            console.log(_chalk2.default.red("⚠ " + aResults.length + " suspicious character" + (aResults.length > 1 ? "s" : "")), "found in " + _chalk2.default.yellow(sFilePath) + ":");

            aResults.forEach(function (oResult) {
                console.log("  ◦ line " + _chalk2.default.cyan(oResult.line) + ", column " + _chalk2.default.cyan(oResult.column + 1) + ": found a " + _chalk2.default.blue(oResult.character.source.name.toLowerCase()) + ", replaced by a " + _chalk2.default.blue(oResult.character.replacement.name.toLowerCase()) + " (" + oResult.character.replacement.character + ").");
            });

            console.log("");
        });
    }
});
