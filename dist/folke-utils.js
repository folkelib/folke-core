"use strict";
function twoDigits(value) {
    return value < 10 ? "0" + value : value;
}
exports.twoDigits = twoDigits;
function isObservable(o) {
    return o.apply !== undefined;
}
exports.isObservable = isObservable;
