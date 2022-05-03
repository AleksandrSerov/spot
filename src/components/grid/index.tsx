import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';

import { Rectangle } from './rectangle';

const generateDots = () => {
	const result = [];

	for (let i = 0; i < 100; i++) {
		result.push([]);
		for (let j = 0; j < 100; j++) {
			result[i].push(0);
		}
	}

	return result;
};

export const App = () => {
	console.log(generateDots());
	const dotsMatrix = generateDots();
	const renderDot = ([x, y]) => <Rectangle key={ `${x}_${y}` } x={ x } y={ y } />;

	return (
		<Stage
			options={ {
				width: 500,
				height: 500,
				antialias: true,
				autoDensity: true,
				backgroundColor: string2hex('#ffffff'),
			} }
		>
			{dotsMatrix.map((dotsArray, i) =>
				dotsArray.map((dotValue, j) => renderDot([i * 5, j * 5])),
			)}
		</Stage>
	);
};
