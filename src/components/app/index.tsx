import { useCallback, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';

import { Button } from './button';
import { Grid } from './grid';
import { Rectangle } from './rectangle';

import styles from './index.module.css';
const getRandomInt = (max: number) => Math.floor(Math.random() * max) as 0 | 1;
const dotSize = 20;

const canvasWidth = 1000;

const generateDots = (generateValue = () => getRandomInt(2)) => {
	const size = canvasWidth / dotSize;

	return new Array(size).fill(null).map(() => new Array(size).fill(null).map(generateValue));
};

const getNextTickDotStatus = (dots: Array<Array<0 | 1>>, dotCoordinates: [number, number]) => {
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

	if ((currentValue === 1 && sumAlive === 2) || sumAlive === 3) {
		return 1;
	}

	if ((currentValue === 1 && sumAlive < 2) || sumAlive > 3) {
		return 0;
	}

	if (sumAlive === 3 && currentValue === 0) {
		return 1;
	}

	return 0;
};

export const App = () => {
	const [dots, setDots] = useState(generateDots());
	const startRef = useRef<HTMLButtonElement>(null);
	const timerRef = useRef<number | null>(null);
	const handleClick = () => {
		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((dotValue, j) => getNextTickDotStatus(dots, [i, j])),
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
			</div>
		</div>
	);
};
