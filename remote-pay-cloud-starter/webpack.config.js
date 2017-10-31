"use strict";

var path = require('path');
var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',  // Just name it
        filename: 'common.js' // Name of the output file
    }
);

module.exports = {
    entry: {
        index_js: "./public/index.js"
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        path: path.resolve(__dirname, './public/built'),
        filename: "[name]-bundle.js"
    },
    plugins: [commonsPlugin]
};
