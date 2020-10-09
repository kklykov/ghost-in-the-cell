const path = require('path')

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: './Bot.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.js'],
	},
	watch: true,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
		ignored: /node_modules/,
	},
}
