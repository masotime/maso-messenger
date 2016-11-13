// really simple "database"
import { safeInt } from 'common/util';

const messages = {};
let bottom = 0;
let top = 0;

export function getMessages(from = bottom, to = top) {
	from = safeInt(from);
	to = safeInt(to);

	return Object.keys(messages)
		.map(id => safeInt(id))
		.filter(id => id > from && id <= to)
		.map(id => ({ ...messages[id] }));
}

export function addMessage(user, message) {
	const msgId = top++;
	messages[msgId] = {
		id: msgId,
		date: Date.now(),
		user,
		message
	};

	return messages[msgId];
}