/* eslint-disable global-require, import/no-commonjs, import/unambiguous */
module.exports = {
    plugins: [
        require('autoprefixer')({
            grid: true,
        }),
        /**
         * Wrap `:hover` styles into `@media(hover)` CSS query to activate hover style only on device has a pointer that
         * can hover elements (ie. not a touch device).
         */
        require('postcss-hover-media-feature')(),
    ],
};
