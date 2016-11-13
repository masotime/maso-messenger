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
const wsInstance = socketify(app);
const wss = wsInstance.getWss();

function broadcast(msg) {
	wss.clients.forEach(client => client.send(JSON.stringify(msg)));
}

app.use(bundler());

app.ws('/messages', ws => ws.on('message', msgStr => {
	const msg = safeParse(msgStr);

	// in all cases, we send back an update of messages
	// received so far to all clients
	switch (msg.type) {
		case 'SEND': {
			const { user, message } = msg;
			if (user && message) {
				addMessage(user, message);
			}

			// ping all clients to get an update
			const reply = { type: 'UPDATES_AVAILABLE' };
			broadcast(reply);
			break;
		}

		case 'RECEIVE': {
			const { id } = msg;
			const messagesToSend = getMessages(id);
			const message = {
				type: 'MESSAGES_UPDATE',
				messages: messagesToSend
			};

			// send a single client the messages to update to
			ws.send(JSON.stringify(message));
			break;			
		}
	}

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