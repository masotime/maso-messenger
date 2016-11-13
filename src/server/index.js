import express from 'express';
import { PORT } from 'common/constants';

// bundling of bundle.js
import bundler from 'server/bundler';

// React stuff
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from 'components';

// websocket stuff
import socketify from 'express-ws';
import { getMessages, addMessage } from 'server/database';
import { safeParse } from 'common/util';

const app = express();
socketify(app);

app.use(bundler());

// expected format:
// {
//	  user: string
//	  message: string
// }
app.ws('/sendMessage', ws => ws.on('message', msg => {
	const { user, message } = safeParse(msg);
	if (user && message) addMessage(user, message);
}));

// expected format:
// { from, to }
app.ws('/getMessages', ws => ws.on('message', msg => {
	const { from, to } = msg;
	const messages = getMessages(from, to);
	ws.send(JSON.stringify(messages));
}));

app.get('/', (req, res) => {
	const model = {
		title: 'Simple Messenger',
		message: 'Chat in the box below',
		messages: getMessages()
	};

	res.status(200).end(`<!DOCTYPE HTML>${renderToString(<App model={model} />)}`);
});

app.listen(PORT, () => console.log(`✅  Web server started at http://localhost:${PORT}`));