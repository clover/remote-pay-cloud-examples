var path = require('path');
var webpack = require('webpack');

var commonsPlugin = new webpack.optimize.CommonsChunkPlugin({
        name: 'commons',
        filename: 'common.js'
    }
);

module.exports = {
    entry: ["babel-polyfill", "./public/index.js"],
    resolve: {
        extensions: ['.js']
    },
    output: {
        path: path.resolve(__dirname, './public/built'),
        filename: "bundle.js"
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
    plugins: [commonsPlugin]
};
