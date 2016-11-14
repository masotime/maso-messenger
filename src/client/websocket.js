/* global window, document */
// it seems I am recreating redux
import { safeParse, max, extract, sleep } from 'common/util';
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
const RETRY_DELAY = 2000;

export default function MessagingClient(websocket, initialState = {}) {
	// maintain some internal state
	const subscribers = [];
	const state = { ...defaultState, ...initialState };
	const { url } = websocket;
	let commands;

	function visibilityCheck() {
		if (document.visibilityState === 'visible') commands.receive(state.top);
	}

	function subscribe(subscription) {
		subscribers.push(subscription);
		subscription(state); // initial push to subscriber
	}

	function callSubscribers() {
		subscribers.forEach(subscription => subscription(state));
	}

	function close() {
		websocket.close();
		if (typeof document !== 'undefined') {
			document.removeEventListener('visibilitychange', visibilityCheck);
		}
	}

	function init(websocket, forceLoad = false) {

		let closed = false;

		websocket.onopen = () => {
			if (closed) return;

			console.log(`✅ Websocket connection established`);
			commands = MessagingCommands(websocket, true);

			if (forceLoad) { // used when reconnecting
				commands.receive(state.top);
			}
		}

		websocket.onmessage = ({ data }) => {
			if (closed) return;

			const msg = safeParse(data);

			switch (msg.type) {
				case WSServer.MESSAGES_UPDATE: {
					const { messages: newMessages } = msg;

					if (newMessages.length !== 0) {
						state.top = max(extract(newMessages, 'id')) + 1;	
					}
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

		websocket.onclose = () => {
			if (closed) return;

			closed = true;
			if (typeof window !== 'undefined') {
				return sleep(RETRY_DELAY).then(() => {
					console.log(`🔗 Attempting to reconnect websocket instance...`);
					websocket = new window.WebSocket(url);
					init(websocket); // notice the recursion
				});
			}
		}

		return MessagingCommands(websocket);
	}

	init(websocket);

	// for mobile devices, force refresh when the page becomes visible
	if (typeof document !== 'undefined') {
		document.addEventListener('visibilitychange', visibilityCheck);
	}

	return {
		send: (...args) => commands.send(...args), // commands is mutable
		subscribe,
		close
	}
}
