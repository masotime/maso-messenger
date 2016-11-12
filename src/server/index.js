import express from 'express';
import { PORT } from 'common/constants';

// bundling of bundle.js
import bundler from 'server/bundler';

// React stuff
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from 'components';

const app = express();

app.use(bundler());

app.get('/', (req, res) => {
	const model = {
		title: 'websockets-sandbox',
		message: 'Hello Benjamin Goh &lt;masotime@gmail.com&gt;!'
	};

	res.status(200).end(`<!DOCTYPE HTML>${renderToString(<App model={model} />)}`);
});

app.listen(PORT, () => console.log(`✅  Web server started at http://localhost:${PORT}`));