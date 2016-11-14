export function safeParse(json) {
	try {
		return JSON.parse(json);
	} catch (e) {
		console.warn(`Problem parsing ${json}`);
		return {};
	}
}

export function safeInt(number, def = 0) {
	const toInt = parseInt(number, 10);
	return isNaN(toInt) ? def : toInt;
}

export function extract(array, fieldname) {
	return array.map(obj => obj[fieldname]);
}

export function max(array) {
	return safeInt(array
		.map(safeInt)
		.reduce((max, curr) => max < curr ? curr : max, array[0]));
}

export function memoize(fn) {
	const memory = {};

	return function(...args) {
		const key = JSON.stringify(args);
		if (!memory.hasOwnProperty(key)) {
			memory[key] = fn(...args);
		}

		return memory[key];
	}
}

export const sleep = duration => new Promise(ok => setTimeout(ok, duration));
