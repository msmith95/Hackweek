var path = require("path");

module.exports = {
  entry: './js/index.js',
	watch: true,
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
   }
};