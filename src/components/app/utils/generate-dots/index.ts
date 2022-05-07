import { getRandomInt } from '../../../../utils/get-random-int';

type Args = {
	generateValue?: () => 0 | 1;
	width: number;
	height: number;
	size: number;
};
export const generateDots = ({
	generateValue = () => getRandomInt(2),
	width,
	height,
	size,
}: Args) => {
	const widthSize = width / size;
	const heightSize = height / size;

	return new Array(heightSize)
		.fill(null)
		.map(() => new Array(widthSize).fill(null).map(generateValue));
};
