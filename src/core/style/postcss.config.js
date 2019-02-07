module.exports = {
    plugins: [
        require('postcss-flexbox-unboxer')(),
        require('autoprefixer')({
            grid: true,
        }),
    ],
};
