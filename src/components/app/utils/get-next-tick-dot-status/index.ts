export const getNextTickDotStatus = (
	dots: Array<Array<0 | 1>>,
	dotCoordinates: [number, number],
	rules: {
		s: Array<number>;
		b: Array<number>;
	},
) => {
	const [i, j] = dotCoordinates;
	const currentValue = dots[i][j];

	const aroundDotsValues = [
		dots[i - 1]?.[j - 1],
		dots[i - 1]?.[j],
		dots[i - 1]?.[j + 1],
		dots[i][j - 1],
		dots[i][j + 1],
		dots[i + 1]?.[j - 1],
		dots[i + 1]?.[j],
		dots[i + 1]?.[j + 1],
	].filter((v) => typeof v === 'number');

	const sumAlive = aroundDotsValues.reduce((acc, value) => acc + value, 0 as number);

	if (currentValue === 1 && rules.s.includes(sumAlive)) {
		return 1;
	}

	if (currentValue === 0 && rules.b.includes(sumAlive)) {
		return 1;
	}

	return 0;
};
