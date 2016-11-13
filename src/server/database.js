// really simple "database"
import { safeInt, memoize, max } from 'common/util';
import fs from 'fs';
import os from 'os';
import { join } from 'path';
import Promise from 'bluebird';

Promise.promisifyAll(fs);

async function createDatabase(file) {

	const dbFile = file || join(os.tmpdir(), 'messages.json');
	let messagesFromFile;

	try {
		messagesFromFile = JSON.parse(await fs.readFileAsync(dbFile));
		console.log(`Using messages from ${dbFile}`);
	} catch (err) {
		console.error(`Couldn't read from database ${dbFile}`);
		messagesFromFile = {};
	}

	const messages = messagesFromFile;
	const bottom = 0;
	let top = max(Object.keys(messages).map(safeInt)) + 1;

	function getMessages(from = bottom, to = top) {
		from = safeInt(from);
		to = safeInt(to);

		return Object.keys(messages)
			.map(id => safeInt(id))
			.filter(id => id >= from && id < to)
			.map(id => ({ ...messages[id] }));
	}

	function addMessage(user, message) {
		const msgId = top++;
		messages[msgId] = {
			id: msgId,
			date: Date.now(),
			user,
			message
		};

		// we write the result to a "database" without waiting for a response
		fs.writeFile(join(os.tmpdir(), 'messages.json'), JSON.stringify(messages));

		return messages[msgId];
	}	

	return { getMessages, addMessage };

}

export default memoize(createDatabase);