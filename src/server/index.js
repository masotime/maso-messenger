import express from 'express';
import { PORT, STATIC_SOURCE } from 'constants/common';

// bundling of bundle.js
import bundler from 'server/bundler';

// React stuff
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from 'components';

// websocket stuff
import socketify from 'express-ws';
import Database from 'server/database';
import { safeParse, max, extract } from 'common/util';

const app = express();
const wsInstance = socketify(app);
const wss = wsInstance.getWss();

function broadcast(msg) {
	wss.clients.forEach(client => client.send(JSON.stringify(msg)));
}

app.use(bundler());
app.use('/static', express.static(STATIC_SOURCE));

app.ws('/messages', ws => ws.on('message', async msgStr => {
	const msg = safeParse(msgStr);
	const db = await Database();

	// in all cases, we send back an update of messages
	// received so far to all clients
	switch (msg.type) {
		case 'SEND': {
			const { user, message } = msg;
			if (user && message) {
				db.addMessage(user, message);
			}

			// ping all clients to get an update
			const reply = { type: 'UPDATES_AVAILABLE' };
			broadcast(reply);
			break;
		}

		case 'RECEIVE': {
			const { top } = msg;
			const messagesToSend = db.getMessages(top);
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

app.get('/', async (req, res) => {
	const db = await Database();
	const model = {
		title: '💬 maso-messenger',
		message: 'Chat in the box below',
		messages: db.getMessages()
	};

	model.top = max(extract(model.messages, 'id')) + 1;

	res.status(200).end(`<!DOCTYPE HTML>${renderToString(<App model={model} />)}`);
});

app.listen(PORT, () => console.log(`✅  Web server started at http://localhost:${PORT}`));