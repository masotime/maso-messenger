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
	return isNaN(toInt) ? def : number;
}

export function extract(array, fieldname) {
	return array.map(obj => obj[fieldname]);
}

export function max(array) {
	return array
		.map(safeInt)
		.reduce((max, curr) => max < curr ? curr : max, array[0]);
}