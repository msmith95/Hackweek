let path = require("path");
let webpack = require("webpack");
let LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  entry: './js/index.js',
  output: {
    filename: 'bundle-prod.js',
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
		new LodashModuleReplacementPlugin,
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		// minify with dead-code elimination
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {comments: false}
		}),
		// optimize module ids by occurence count
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.DedupePlugin(),
	]
};