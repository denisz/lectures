var webpack = require('webpack');
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: [
    './src/index'
  ],
  module: {
    loaders: [
      { test: /\.js?$/,   loader: 'babel', exclude: [/node_modules/, 'electron'], query: {presets: ['es2015','react']} },
      { test: /\.less$/,  loader: 'style!css!less'},
      { test: /\.s?css$/, loader: 'style!css!sass' },
      { test: /\.json$/,  loader: 'json-loader'},

      { test: /\.woff2?$/, loader: 'url', options: {name: 'fonts/[hash].[ext]', limit: 50000, mimetype: 'application/font-woff'}},
      { test: /\.(ttf|svg|eot)$/, loader: 'file', options: {name: 'fonts/[hash].[ext]'} },
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  externals: [
    (function () {
      var IGNORES = [
        'electron'
      ];
      return function (context, request, callback) {
        if (IGNORES.indexOf(request) >= 0) {
          return callback(null, "require('" + request + "')");
        }
        return callback();
      };
    })()
  ],
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      filename: './app.html',
      template: './src/app.html',
      inject: false
    }),
    new HtmlWebpackPlugin({
      filename: './welcome.html',
      template: './src/welcome.html',
      inject: false
    }),
    new CopyWebpackPlugin([
      { from: './src/assets/data',  to: './data' },
      { from: './src/assets/images', to: './images' },
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
