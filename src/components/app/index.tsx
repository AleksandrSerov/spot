import { FC, useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import cn from 'classnames';

import backrake from '../../patterns/backrake.json';
import diehard from '../../patterns/die-hard.json';
import spaceship from '../../patterns/spaceship.json';
import spaceship2 from '../../patterns/spaceship2.json';
import { Button } from '../button';
import { Select, SelectProps } from '../select';

import { generateDots } from './utils/generate-dots';
import { getNextTickDotStatus } from './utils/get-next-tick-dot-status';
import { getRuleName } from './utils/get-rule-name';
import { mergeDots } from './utils/merge-dots';
import { moveTo } from './utils/move-to';
import { ClickableAria } from './clickable-aria';
import { DEFAULT_DOT_SIZE, GAME_RULES } from './constants';
import { Grid } from './grid';
import { Help } from './help';
import { Rectangle } from './rectangle';
import { Stats } from './stats';

import styles from './index.module.css';

const patternsMap = {
	spaceship1: spaceship,
	spaceship2,
	backrake,
	diehard,
};

export const App: FC = () => {
	const CANVAS_WIDTH = (Math.trunc(window.innerWidth / DEFAULT_DOT_SIZE) + 1) * DEFAULT_DOT_SIZE;
	const CANVAS_HEIGHT =
		(Math.trunc(window.innerHeight / DEFAULT_DOT_SIZE) + 1) * DEFAULT_DOT_SIZE;

	const defaultDots = generateDots({
		width: CANVAS_WIDTH,
		height: CANVAS_HEIGHT,
		size: DEFAULT_DOT_SIZE,
	});

	const [controlsView, setControlsView] = useState<'full' | 'minimal'>('full');
	const [pattern, setPattern] = useState<keyof typeof patternsMap>('spaceship1');

	const [pointerMode, setPointerMode] = useState<'default' | 'pattern'>('default');
	const [fillingMode, setFillingMode] = useState<1 | 0 | null>(null);
	const [prevDots, setPrevDots] = useState(defaultDots);
	const [tickCount, setTickCount] = useState(0);
	const [playState, setPlayState] = useState<'iddle' | 'playing'>('iddle');
	const [rules, setRules] = useState(GAME_RULES.default);
	const [dotSize, setDotSize] = useState(DEFAULT_DOT_SIZE);
	const [dots, setDots] = useState(defaultDots);
	const startRef = useRef<HTMLButtonElement>(null);
	const timerRef = useRef<number | null>(null);

	useEffect(() => {
		const generated = generateDots({
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			size: dotSize,
		});

		setDots(generated);
	}, [CANVAS_HEIGHT, CANVAS_WIDTH, dotSize]);

	const handleTick = () => {
		setTickCount((prevTickCount) => prevTickCount + 1);

		setDots((prevDots) => {
			const updatedDots = prevDots.map((dotsArray, i) =>
				dotsArray.map((_, j) => getNextTickDotStatus(prevDots, [i, j], rules)),
			);

			return updatedDots;
		});
	};

	const handleGenerate = () => {
		setDots(generateDots({ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, size: dotSize }));
	};

	const handleClear = () => {
		setDots(
			generateDots({
				width: CANVAS_WIDTH,
				height: CANVAS_HEIGHT,
				size: dotSize,
				generateValue: () => 0,
			}),
		);
	};

	const handleToggle = () => {
		if (typeof timerRef.current === 'number') {
			setPlayState('iddle');
			clearInterval(timerRef.current);
			timerRef.current = null;

			return;
		}

		setPlayState('playing');
		timerRef.current = setInterval(handleTick, 75);
	};

	const handleDotMouseMove = (e: any) => {
		const { x: rawX, y: rawY } = e.data.global;

		const [x, y] = [rawX / dotSize, rawY / dotSize].map(Math.trunc);

		const leftMouseButtonPressed = e.data.buttons === 1;

		if (!leftMouseButtonPressed) {
			if (fillingMode !== null) {
				setFillingMode(null);
			}

			if (pointerMode === 'pattern') {
				const patternValue = patternsMap[pattern];

				const fitted = (
					dots.map((array, i) => array.map((_, j) => patternValue[i]?.[j] ?? 0)) as Array<
						Array<1 | 0>
					>
				)
					.map(
						moveTo({
							axis: 'x',
							direction: 1,
							offset: x - Math.trunc(patternValue[0].length / 2) - 1,
						}),
					)
					.map(
						moveTo({
							axis: 'y',
							direction: 1,
							offset: y - Math.trunc(patternValue.length / 2) - 1,
						}),
					);

				setDots(mergeDots(fitted, prevDots));
			}

			return;
		}

		if (leftMouseButtonPressed && pointerMode === 'default' && fillingMode === null) {
			setFillingMode(Math.abs(1 - dots[y][x]) as 0 | 1);
		}

		if (fillingMode === null) {
			return;
		}
		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((dotValue, j) => {
				if (x === j && y === i) {
					return fillingMode;
				}

				return dotValue;
			}),
		);

		setDots(updatedDots);
	};

	const handleDotClick = (e: any) => {
		if (pointerMode === 'pattern') {
			setPointerMode('default');

			return;
		}
		const { x: rawX, y: rawY } = e.data.global;
		const [x, y] = [rawX / dotSize, rawY / dotSize].map(Math.trunc);

		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((dotValue, j) => {
				if (x === j && y === i) {
					return Math.abs(1 - dotValue) as 0 | 1;
				}

				return dotValue;
			}),
		);

		setDots(updatedDots);
	};

	const handlePointerDown = (e: any) => {
		if (pointerMode === 'pattern') {
			return;
		}

		const { x: rawX, y: rawY } = e.data.global;
		const [x, y] = [rawX / dotSize, rawY / dotSize].map(Math.trunc);
		const direction = Math.abs(1 - dots[y][x]) as 0 | 1;

		setFillingMode(direction);

		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((dotValue, j) => {
				if (x === j && y === i) {
					return direction;
				}

				return dotValue;
			}),
		);

		setDots(updatedDots);
	};

	const renderDot = ([i, j]: [number, number]) => {
		if (dots[i][j] === 0) {
			return null;
		}

		return (
			<Rectangle.Graphics
				key={ `${i}_${j}` }
				x={ j * dotSize }
				y={ i * dotSize }
				width={ dotSize }
				height={ dotSize }
				onClick={ handleDotClick }
				onMouseOver={ handleDotMouseMove }
				onPointerDown={ handlePointerDown }
			/>
		);
	};

	const handleRulesChange = (e: any) => {
		setRules(GAME_RULES[e.target.value as 'islands' | 'corals' | 'default']);
	};

	const handleDotSizeChange = (e: any) => {
		setDotSize(Number(e.target.value));
	};

	const population = dots.reduce(
		(acc, dotsArray) => acc + dotsArray.reduce((acc, item) => acc + item, 0 as number),
		0,
	);

	const maxPopulation = dots.length * dots[0].length;
	const handlePatternChange: SelectProps['onChange'] = (e) => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		setPattern(e.target.value);
	};

	return (
		<div className={ styles.app }>
			<Stats
				className={ styles.stats }
				canvasWidth={ CANVAS_WIDTH }
				canvasHeight={ CANVAS_HEIGHT }
				population={ population }
				maxPopulation={ maxPopulation }
				tickCount={ tickCount }
			/>
			<div className={ styles.canvas }>
				<Stage
					width={ CANVAS_WIDTH }
					height={ CANVAS_HEIGHT }
					options={ {
						backgroundColor: string2hex('#ffffff'),
						powerPreference: 'high-performance',
					} }
				>
					<ClickableAria
						width={ CANVAS_WIDTH }
						height={ CANVAS_HEIGHT }
						onClick={ handleDotClick }
						onMouseOver={ handleDotMouseMove }
						onPointerDown={ handlePointerDown }
					/>

					{dots.map((dotsArray, i) => dotsArray.map((_, j) => renderDot([i, j])))}

					<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ dotSize } />
				</Stage>
			</div>
			<div className={ cn(styles.controls, [styles[controlsView]]) }>
				<div
					className={ styles.dropdownButton }
					onClick={ () =>
						setControlsView((prev) => (prev === 'full' ? 'minimal' : 'full'))
					}
				>
					{controlsView === 'full' && 'Hide ▲'}
					{controlsView === 'minimal' && 'Show ▼'}
				</div>
				<Button onClick={ handleToggle }>
					{playState === 'iddle' && 'Start'}
					{playState === 'playing' && 'Stop'}
				</Button>
				<Button ref={ startRef } onClick={ handleTick }>
					Tick
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
					label='Choose pattern, click Copy pattern'
					onChange={ handlePatternChange }
					id='pattern-select'
					name='Pattern select'
					value={ pattern }
					options={ Object.keys(patternsMap).map((patternName) => ({
						content: patternName,
						value: patternName,
					})) }
				/>
				<Select
					label='Choose a dot size:'
					onChange={ handleDotSizeChange }
					id='dot-size'
					name='Dot size'
					value={ String(dotSize) }
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
				<Select
					label='Choose a game rules'
					onChange={ handleRulesChange }
					id='rules-select'
					name='rules'
					options={ [
						{
							content: `Default - ${getRuleName(GAME_RULES.default)}`,
							value: 'default',
						},
						{
							content: `Corals - ${getRuleName(GAME_RULES.corals)}`,
							value: 'corals',
						},
						{
							content: `Islands - ${getRuleName(GAME_RULES.islands)}`,
							value: 'islands',
						},
						{
							content: `Fractals - ${getRuleName(GAME_RULES.fractals)}`,
							value: 'fractals',
						},
					] }
				/>
			</div>
			<Help />
		</div>
	);
};
