// bundling of bundle.js
// there is a lot of boilerplate here which we want to avoid as much as possible
// TODO: Move into separate node module
import webpack from 'webpack';
import { Router } from 'express';
import compression from 'compression';
import MemoryFs from 'memory-fs';

import { BUNDLE_PATHNAME, BUNDLE_SOURCE } from 'constants/common';

let error;
let compiling = true;

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

console.log('⌛️  Compiling...');
compiler.watch({}, (err, stats) => {
	error = err || stats.hasErrors() && stats.toString({
		chunks: false,
		colors: true
	});

	if (error) {
		console.error(error);
	} else {
		console.log('✅  Bundle compiled');
		compiling = false;
	}
});

compiler.plugin('watch-run', (watching, cb) => {
	console.log('⌛️  Recompiling...');
	compiling = true;
	cb();
});

const sleep = duration => new Promise(ok => setTimeout(ok, duration));
const retry = (condFn, execFn, duration = 500) => {
	if (condFn()) {
		return Promise.resolve(execFn());
	} else {
		console.log('😴  Please wait...');
		return sleep(duration).then(() => retry(condFn, execFn, duration));
	}
}

export default function() {

	const router = Router();

	router.use(compression({ level: 9 }));
	router.get(BUNDLE_PATHNAME, (req, res) => {
		if (error) {
			return res.status(500).send('Webpack compilation error, check console');
		}

		return retry(() => !compiling, () => {
			res.set('Content-type', 'application/javascript');
			res.send(fs.readFileSync('/bundle.js'))
		});
	});

	return router;
}