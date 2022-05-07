import { useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';

import spaceship3 from '../../patterns/spaceship3.json';
import { Select } from '../select';

import { generateDots } from './utils/generate-dots';
import { moveTo } from './utils/move-to';
import { Button } from './button';
import { ClickableAria } from './clickable-aria';
import { Grid } from './grid';
import { Rectangle } from './rectangle';
import { Stats } from './stats';

import styles from './index.module.css';

const DEFAULT_DOT_SIZE = 20;

const canvasWidth = 1500;
const canvasHeight = 1000;

const gameRules = {
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

const mergeDots = (dots1: Array<Array<0 | 1>>, dots2: Array<Array<0 | 1>>) =>
	dots1.map((dotsArray, i) =>
		dotsArray.map((_, j) => {
			if (dots1[i][j] === 1) {
				return 1;
			}
			if (dots1[i][j] === 0) {
				return dots2[i][j];
			}

			return dots1[i][j];
		}),
	);

const getNextTickDotStatus = (
	dots: Array<Array<0 | 1>>,
	dotCoordinates: [number, number],
	rules = gameRules.default,
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
const defaultDots = generateDots({
	width: canvasWidth,
	height: canvasHeight,
	size: DEFAULT_DOT_SIZE,
	generateValue: () => 0,
});

export const App = () => {
	const [pointerMode, setPointerMode] = useState<'default' | 'pattern'>('default');
	const [prevDots, setPrevDots] = useState(defaultDots);
	const [tickCount, setTickCount] = useState(0);
	const [rules, setRules] = useState(gameRules.default);
	const [dotSize, setDotSize] = useState(DEFAULT_DOT_SIZE);
	const [dots, setDots] = useState(defaultDots);
	const startRef = useRef<HTMLButtonElement>(null);
	const timerRef = useRef<number | null>(null);

	const handleClick = () => {
		setTickCount((prevTickCount) => prevTickCount + 1);

		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((_, j) => getNextTickDotStatus(dots, [i, j], rules)),
		);

		setDots(updatedDots);
	};

	const handleGenerate = () => {
		setDots(generateDots({ width: canvasWidth, height: canvasHeight, size: dotSize }));
	};

	const handleClear = () => {
		setDots(
			generateDots({
				width: canvasWidth,
				height: canvasHeight,
				size: dotSize,
				generateValue: () => 0,
			}),
		);
	};

	const handleToggle = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;

			return;
		}

		timerRef.current = setInterval(() => {
			startRef.current?.click();
		}, 150);
	};

	const handleDotClick = (eventType: 'click' | 'mouseover') => (e: any) => {
		const { x: rawX, y: rawY } = e.data.global;
		const [x, y] = [rawX / dotSize, rawY / dotSize].map(Math.trunc);

		if (eventType === 'mouseover' && e.data.buttons !== 1) {
			if (pointerMode === 'pattern') {
				const fitted = (
					dots.map((array, i) => array.map((_, j) => spaceship3[i]?.[j] ?? 0)) as Array<
						Array<1 | 0>
					>
				)
					.map(
						moveTo({
							axis: 'x',
							direction: 1,
							offset: x - Math.trunc(spaceship3[0].length / 2) - 1,
						}),
					)
					.map(
						moveTo({
							axis: 'y',
							direction: 1,
							offset: y - Math.trunc(spaceship3.length / 2) - 1,
						}),
					);

				setDots(mergeDots(fitted, prevDots));
			}

			return;
		}

		if (eventType === 'click' && pointerMode === 'pattern') {
			setPointerMode('default');

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
	const handleRulesChange = (e: any) => {
		setRules(gameRules[e.target.value as 'islands' | 'corals' | 'default']);
	};

	const handleDotSizeChange = (e: any) => {
		setDotSize(Number(e.target.value));
	};

	const population = dots.reduce(
		(acc, dotsArray) => acc + dotsArray.reduce((acc, item) => acc + item, 0 as number),
		0,
	);

	const maxPopulation = dots.length * dots.length;

	return (
		<div className={ styles.app }>
			<div className={ styles.playArea }>
				<div className={ styles.canvas }>
					{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
					{/* @ts-ignore */}
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
				<Stats
					canvasWidth={ canvasWidth }
					canvasHeight={ canvasHeight }
					population={ population }
					maxPopulation={ maxPopulation }
					tickCount={ tickCount }
				/>
			</div>

			<div className={ styles.controls }>
				<Button onClick={ handleToggle }>Start/Stop</Button>
				<Button ref={ startRef } onClick={ handleClick }>
					tick
				</Button>
				<Button onClick={ handleGenerate }>Generate life</Button>
				<Button onClick={ handleClear }>Clear field</Button>
				<Button
					onClick={ () => {
						setPointerMode('pattern');
						setPrevDots(dots);
					} }
				>
					Copy pattern
				</Button>
				<Select
					label='Choose a game rules'
					onChange={ handleRulesChange }
					id='rules-select'
					name='rules'
					options={ [
						{
							content: 'Default',
							value: 'default',
						},
						{
							content: 'Corals',
							value: 'corals',
						},
						{
							content: 'Islands',
							value: 'islands',
						},
						{
							content: 'Fractals',
							value: 'fractals',
						},
					] }
				/>
				<Select
					label='Choose a dot size:'
					onChange={ handleDotSizeChange }
					id='dot-size'
					name='Rules'
					options={ [
						{
							content: '20',
							value: '20',
						},
						{
							content: '10',
							value: '10',
						},
						{
							content: '5',
							value: '5',
						},
					] }
				/>
			</div>
		</div>
	);
};
