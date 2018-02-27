const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: ["babel-polyfill", path.join(__dirname, 'src', 'app-client.js')],
    output: {
        path: path.join(__dirname, 'src', 'static', 'js'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: path.join(__dirname, 'src'),
            loader: "babel-loader",
            query: {
                presets: [
                    'es2015',
                    'react'
                ]
            }
        }, {test: /\.tsx?$/, loader: "ts-loader"}
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    ]
};