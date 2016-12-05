var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: './js/index.js',
  output: {
    filename: 'bundle.js',
    path: './js/'
  },
  resolve: {
	  alias: {
	    'vue$': 'vue/dist/vue.js'
	  }
	},
	resolveLoader: {
        root: path.join(__dirname, 'node_modules'),
    },
  module: {
  loaders: [{
        test: /\.vue$/,
        loader: 'vue'
      },{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }]
   },
	plugins: [
		// short-circuits all Vue.js warning code
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		// minify with dead-code elimination
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		// optimize module ids by occurence count
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
		new CompressionPlugin({
			asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.html$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
};