/**
 * Build config for electron 'Main Process' file
 */

var webpack = require('webpack');

module.exports = {
	// entry: ['babel-polyfill', './main'],
	entry: './main',

	module: {
		loaders : [
			{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
			{ test: /\.json$/,  loader: 'json-loader'}
		]
	},

	// 'main.js' in root
	output: {
		publicPath: '/',
		filename: 'electron.js'
	},

	plugins: [
		/**
		 * Create global constants which can be configured at compile time.
		 *
		 * Useful for allowing different behaviour between development builds and
		 * release builds
		 *
		 * NODE_ENV should be production so that modules do not perform certain
		 * development checks
		 */
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		})
	],

	/**
	 * Set target to Electron specific node.js env.
	 * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
	 */
	target: 'electron-main',

	/**
	 * Disables webpack processing of __dirname and __filename.
	 * If you run the bundle in node.js it falls back to these values of node.js.
	 * https://github.com/webpack/webpack/issues/2010
	 */
	node: {
		__dirname: false,
		__filename: false
	}
};
