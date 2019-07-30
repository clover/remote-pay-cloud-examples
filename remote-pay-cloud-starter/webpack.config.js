const path = require('path');

module.exports = {
    mode: "development",
    entry: {
        "babel": "babel-polyfill",
        "cloudExample": "./public/index.js"
    },
    resolve: {
        extensions: ['.js']
    },
    output: {
        path: path.resolve(__dirname, './public/built'),
        filename: "[name].js",
        libraryTarget: 'var',
        library: 'clover'
    },
    module: {
      rules: [
        {
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['es2015'],
              plugins: ["transform-remove-strict-mode"]
            }
          }
        }
      ]
    },
    devtool: 'eval-source-map'
};