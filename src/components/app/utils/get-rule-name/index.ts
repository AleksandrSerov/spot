export const getRuleName = (rule: { s: Array<number>; b: Array<number> }) => {
	const [s, b] = [rule.s, rule.b].map((item) => item.join(''));

	return `B${b}/S${s}`;
};
