import fs from 'fs/promises';
import { EOL } from 'os';

const parseValue = (raw) => {
	if (raw === '.') {
		return 0;
	}
	if (raw === '0') {
		return 1;
	}
	return 1;
};

const patternFilepath = './index.txt';

const parse = (file) => {
	const [name, author, description, wikiLink, srcLink, ...pattern] = file.split(EOL);
	console.log(pattern);
	const parsed = pattern.map((string) => string.split("").map(parseValue));
	console.log(parsed);
	return parsed;
};

const main = async () => {
	const file = await fs.readFile(patternFilepath).then((data) => data.toString());

	return parse(file);
};

main();
