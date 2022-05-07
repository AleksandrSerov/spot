import { useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';

import { Button } from './button';
import { ClickableAria } from './clickable-aria';
import { Grid } from './grid';
import { Rectangle } from './rectangle';

import styles from './index.module.css';
const getRandomInt = (max: number) => Math.floor(Math.random() * max) as 0 | 1;
const DEFAULT_DOT_SIZE = 20;

const canvasWidth = 1500;
const canvasHeight = 800;

const generateDots = (generateValue = () => getRandomInt(2), dotSize: number) => {
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
	const [tickCount, setTickCount] = useState(0);
	const [rules, setRules] = useState(grules.default);
	const [dotSize, setDotSize] = useState(DEFAULT_DOT_SIZE);
	const [dots, setDots] = useState(generateDots(undefined, dotSize));
	const startRef = useRef<HTMLButtonElement>(null);
	const timerRef = useRef<number | null>(null);
	const handleClick = () => {
		setTickCount((prevTickCount) => prevTickCount + 1);

		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((_, j) => getNextTickDotStatus(dots, [i, j], rules)),
		);

		setDots(updatedDots);
	};

	useEffect(() => {
		setDots(generateDots(undefined, dotSize));
	}, [dotSize]);

	const handleGenerate = () => {
		setDots(generateDots(undefined, dotSize));
	};

	const handleClear = () => {
		setDots(generateDots(() => 0, dotSize));
	};

	const handleToggle = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;

			return;
		}

		timerRef.current = setInterval(() => {
			startRef.current?.click();
		}, 125);
	};

	const handleDotClick = (eventType: 'click' | 'mouseover') => (e: any) => {
		const { x: rawX, y: rawY } = e.data.global;
		const [x, y] = [rawX / dotSize, rawY / dotSize].map(Math.trunc);

		if (eventType === 'mouseover' && e.data.buttons !== 1) {
			return;
		}
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
	};

	const renderDot = ([i, j]: [number, number], dotValue: 0 | 1) => {
		if (dotValue === 0) {
			return null;
		}

		return (
			<Rectangle.Graphics
				alive={ dotValue === 1 }
				key={ `${i}_${j}` }
				x={ j * dotSize }
				y={ i * dotSize }
				width={ dotSize }
				height={ dotSize }
				onClick={ handleDotClick('click') }
				onMouseOver={ handleDotClick('mouseover') }
			/>
		);
	};
	const handleChange = (e: any) => {
		setRules(grules[e.target.value as 'islands' | 'corals' | 'default']);
	};

	const handleDotSizeChange = (e: any) => {
		setDotSize(Number(e.target.value));
	};

	return (
		<div className={ styles.app }>
			<div className={ styles.playArea }>
				<div className={ styles.canvas }>
					<Stage
						width={ canvasWidth }
						height={ canvasHeight }
						options={ {
							backgroundColor: string2hex('#ffffff'),
							powerPreference: 'high-performance',
						} }
					>
						<ClickableAria
							width={ canvasWidth }
							height={ canvasHeight }
							onClick={ handleDotClick('click') }
							onMouseOver={ handleDotClick('mouseover') }
						/>

						{dots.map((dotsArray, i) =>
							dotsArray.map((dotValue, j) => renderDot([i, j], dotValue)),
						)}

						<Grid width={ canvasWidth } height={ canvasHeight } dotWidth={ dotSize } />
					</Stage>
				</div>

				<div className={ styles.stats }>
					<div>Tick: {tickCount}</div>
					<div>
						Population:{' '}
						{dots.reduce(
							(acc, dotsArray) =>
								acc + dotsArray.reduce((acc, item) => acc + item, 0 as number),
							0,
						)}
					</div>

					<div>Max population: {dots.length * dots.length}</div>
					<div>
						Canvas size: {canvasWidth}px X {canvasHeight}px
					</div>
				</div>
			</div>

			<div className={ styles.controls }>
				<Button onClick={ handleToggle }>Start/Stop</Button>
				<Button ref={ startRef } onClick={ handleClick }>
					tick
				</Button>
				<Button onClick={ handleGenerate }>Generate life</Button>
				<Button onClick={ handleClear }>Clear field</Button>
				<div className={ styles.selectField }>
					<label htmlFor='rules-select'>Choose a game rules:</label>
					<select
						name='rules'
						id='rules-select'
						onChange={ handleChange }
						className={ styles.select }
					>
						<option value='default'>Default</option>
						<option value='corals'>Corals</option>
						<option value='islands'>Islands</option>
						<option value='fractals'>Fractals</option>
					</select>
				</div>
				<div className={ styles.selectField }>
					<label htmlFor='rules-select'>Choose a dot size:</label>
					<select
						name='Dot size'
						id='dot-size'
						onChange={ handleDotSizeChange }
						className={ styles.select }
					>
						<option value='20'>20</option>
						<option value='10'>10</option>
						<option value='5'>5</option>
					</select>
				</div>
			</div>
		</div>
	);
};
