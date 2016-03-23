define(["require", "exports"], function (require, exports) {
    "use strict";
    function twoDigits(value) {
        return value < 10 ? "0" + value : value;
    }
    exports.twoDigits = twoDigits;
});
