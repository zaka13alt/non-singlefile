// silent-console.js
(() => {
    "use strict";

    // Keep a private history if you want code to "log"
    // without anything reaching the browser console.
    const history = [];

    function createLogger(type) {
        return function (...args) {
            history.push({
                type,
                args,
                timestamp: Date.now()
            });

            // Intentionally do nothing.
            return undefined;
        };
    }

    const methods = [
        "log",
        "info",
        "warn",
        "error",
        "debug",
        "trace",
        "dir",
        "dirxml",
        "table",
        "group",
        "groupCollapsed",
        "groupEnd",
        "time",
        "timeEnd",
        "timeLog",
        "count",
        "countReset",
        "assert",
        "clear",
        "profile",
        "profileEnd",
        "timeStamp"
    ];

    for (const method of methods) {
        Object.defineProperty(console, method, {
            value: createLogger(method),
            writable: false,
            configurable: false,
            enumerable: true
        });
    }

    // Optional: expose the stored history without using the console.
    Object.defineProperty(console, "__history__", {
        value: history,
        writable: false,
        configurable: false,
        enumerable: false
    });

    Object.freeze(console);
})();
