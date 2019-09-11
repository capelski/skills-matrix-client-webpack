const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './source/js/index.js',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'main.js?$modena=skills-matrix-client-webpack'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader'
				// Babel config is located at .babelrc
			}
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin(),
		new HtmlWebpackPlugin({template: './source/index.html'}),
		new CopyWebpackPlugin([{
			from: './source/css',
			to: 'css/[name].[ext]'
		}, {
			from: './source/images',
			to: 'images/[name].[ext]'
		}, {
            context: './source/plugins',
            from: '**/*',
            to: './plugins'
        }])
	]
};
