// it seems I am recreating redux
import { safeParse, max, extract } from 'common/util';
import * as WSServer from 'constants/websocket/server';
import * as WSClient from 'constants/websocket/client';

function MessagingCommands(websocket) {
	function receive(top) {
		const message = {
			type: WSClient.RECEIVE,
			top
		};

		websocket.send(JSON.stringify(message));
	}

	function send(user, msg) {
		const message = {
			type: WSClient.SEND,
			user,
			message: msg
		}

		websocket.send(JSON.stringify(message));
	}

	return { send, receive };
}

const defaultState = { top: 0, messages: [] };

export default function MessagingClient(websocket, initialState = {}) {
	// maintain some internal state
	const subscribers = [];
	const state = { ...defaultState, ...initialState };
	const commands = MessagingCommands(websocket);

	function subscribe(subscription) {
		subscribers.push(subscription);
		subscription(state); // initial push to subscriber
	}

	function callSubscribers() {
		subscribers.forEach(subscription => subscription(state));
	}

	function close() {
		websocket.close();
	}

	websocket.onmessage = ({ data }) => {
		const msg = safeParse(data);

		switch (msg.type) {
			case WSServer.MESSAGES_UPDATE: {
				const { messages: newMessages } = msg;
				state.top = max(extract(newMessages, 'id')) + 1;
				state.messages = state.messages.concat(newMessages);
				callSubscribers();
				break;
			}

			case WSServer.UPDATES_AVAILABLE: {
				commands.receive(state.top);
				break;
			}
		}
	}

	return {
		send: commands.send,
		subscribe,
		close
	}
}
