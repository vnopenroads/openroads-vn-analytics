'use strict'

const tryToFloatify = (e) => {
    var f = parseFloat(e);
    return isNaN(f) ? e : f;
}

// Bootstrap table stores everything as strings, so we have to convert back to floats
export function floatifyEntries(e) {
    return Object.fromEntries(
        Object.entries(e).map(([key, val]) => [key, tryToFloatify(val)])
    );
};