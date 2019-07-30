const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        "cloudExample": "./public/index.ts"
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, './public/built'),
        libraryTarget: 'var',
        library: 'clover'
    },
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /(node_modules|bower_components)/
            }
        ]
    },
    devtool: 'inline-source-map'
};