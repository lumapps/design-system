/** Print debug info and kill process. */
module.exports = function debug(...args) {
    console.debug('dbg', ...args);
    console.debug();
    process.exit(0);
};
