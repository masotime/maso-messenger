// bundling of bundle.js
// there is a lot of boilerplate here which we want to avoid as much as possible
// TODO: Move into separate node module
import webpack from 'webpack';
import { Router } from 'express';
import MemoryFs from 'memory-fs';

import { BUNDLE_PATHNAME, BUNDLE_SOURCE } from 'common/constants';

let error;
const fs = new MemoryFs();
const compiler = webpack({
	entry: { 
		app: [
			require.resolve('babel-polyfill'),
			BUNDLE_SOURCE
		]
	},
	output: {
		path: '/',
		publicPath: '/',
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /.js$/,
				exclude: /node_modules/,
				loader: require.resolve('babel-loader'),
			}
		]
	},
	devtool: 'inline-source-map'
});

compiler.outputFileSystem = fs;

compiler.watch({}, (err, stats) => {
	error = err || stats.hasErrors() && stats.toString({
		chunks: false,
		colors: true
	});

	if (error) {
		console.error(error);
	} else {
		console.log('✅  Bundle compiled');
	}
});

export default function() {

	const router = Router();

	router.get(BUNDLE_PATHNAME, (req, res) => {
		if (error) {
			return res.status(500).send('Webpack compilation error, check console');
		}

		return res.send(fs.readFileSync('/bundle.js'));
	});

	return router;
}