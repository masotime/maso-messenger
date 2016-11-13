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