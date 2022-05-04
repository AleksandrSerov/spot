import { useCallback, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';

import { Button } from './button';
import { Grid } from './grid';
import { Rectangle } from './rectangle';

import styles from './index.module.css';
const getRandomInt = (max: number) => Math.floor(Math.random() * max) as 0 | 1;
const dotSize = 20;

const canvasWidth = 800;

const generateDots = (generateValue = () => getRandomInt(2)) => {
	const size = canvasWidth / dotSize;

	return new Array(size).fill(null).map(() => new Array(size).fill(null).map(generateValue));
};

const grules = {
	default: {
		b: [3],
		s: [2, 3],
	},
	corals: {
		b: [3],
		s: [0, 1, 2, 3, 4, 5, 6, 7, 8],
	},
	islands: {
		b: [5, 6, 7, 8],
		s: [4, 5, 6, 7, 8],
	},
	fractals: {
		b: [1],
		s: [0, 1, 2, 3, 4, 5, 6, 7, 8],
	},
};

const getNextTickDotStatus = (
	dots: Array<Array<0 | 1>>,
	dotCoordinates: [number, number],
	rules = grules.default,
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
	];

	const sumAlive = aroundDotsValues.reduce((acc, value) => acc + value, 0 as number);

	if (currentValue === 1 && rules.s.includes(sumAlive)) {
		return 1;
	}

	if (currentValue === 0 && rules.b.includes(sumAlive)) {
		return 1;
	}

	return 0;
};

export const App = () => {
	const [dots, setDots] = useState(generateDots());
	const [rules, setRules] = useState(grules.default);
	const startRef = useRef<HTMLButtonElement>(null);
	const timerRef = useRef<number | null>(null);
	const handleClick = () => {
		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((dotValue, j) => getNextTickDotStatus(dots, [i, j], rules)),
		);

		setDots(updatedDots);
	};

	const handleGenerate = () => {
		setDots(generateDots());
	};

	const handleClear = () => {
		setDots(generateDots(() => 0));
	};

	const handleToggle = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;

			return;
		}

		timerRef.current = setInterval(() => {
			startRef.current?.click();
		}, 100);
	};

	const handleDotClick = useCallback(
		([y, x]: [number, number]) =>
			() => {
				const updatedDots = dots.map((dotsArray, i) =>
					dotsArray.map((dotValue, j) => {
						if (x === j && y === i) {
							if (dotValue === 0) {
								return 1;
							}

							return 0;
						}

						return dotValue;
					}),
				);

				setDots(updatedDots);
			},
		[dots],
	);

	const renderDot = ([i, j]: [number, number], dotValue: 0 | 1) => (
		<Rectangle
			onClick={ handleDotClick([i, j]) }
			alive={ dotValue === 1 }
			key={ `${i}_${j}` }
			x={ (j * dotSize) / 2 }
			y={ (i * dotSize) / 2 }
			width={ dotSize }
			height={ dotSize }
		/>
	);

	const handleChange = (e) => {
		setRules(grules[e.target.value as 'islands' | 'corals' | 'default']);
	};

	return (
		<div>
			<Stage
				className={ styles.canvas }
				width={ canvasWidth }
				height={ canvasWidth }
				options={ {
					antialias: true,
					autoDensity: true,
					backgroundColor: string2hex('#ffffff'),
					forceCanvas: false,
					powerPreference: 'high-performance',
				} }
			>
				{dots.map((dotsArray, i) =>
					dotsArray.map((dotValue, j) => renderDot([i, j], dotValue)),
				)}
				<Grid width={ canvasWidth } height={ canvasWidth } dotWidth={ dotSize } />
			</Stage>
			<div className={ styles.controls }>
				<Button onClick={ handleToggle }>Start/Stop</Button>
				<Button ref={ startRef } onClick={ handleClick }>
					tick
				</Button>
				<Button onClick={ handleGenerate }>Generate life</Button>
				<Button onClick={ handleClear }>Clear field</Button>
				<div>
					<label htmlFor='rules-select'>Choose a game rules:</label>
					<select name='rules' id='rules-select' onChange={ handleChange }>
						<option value='default'>Default</option>
						<option value='corals'>Corals</option>
						<option value='islands'>Islands</option>
						<option value='fractals'>Fractals</option>
					</select>
				</div>
			</div>
		</div>
	);
};
