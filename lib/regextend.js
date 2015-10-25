RegExp.prototype.execAll = function(string) {
    var match = null;
    var matches = new Array();
    while (match = this.exec(string)) {
        matches.push(match);
    }
    return !!matches.length && matches;
};
