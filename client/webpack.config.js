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
      { test: /\.js?$/,   loader: 'babel', exclude: /node_modules/ },
      { test: /\.less$/,  loader: 'style!css!less-loader'},
      { test: /\.s?css$/, loader: 'style!css!sass' },
      { test: /\.json$/,  loader: 'json-loader'},
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,  loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,   loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,   loader: 'url?limit=10000&mimetype=image/svg+xml' },
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
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      filename: './app.html',
      template: './src/app.html',
      inject: false
    }),
    new CopyWebpackPlugin([
      { from: './src/assets/data', to: './data' }
    ]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
