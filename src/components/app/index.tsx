import { FC, useEffect, useRef, useState } from 'react';
import { Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import matches from 'lodash/matches';

import { Button } from '../button';

import { generateDots } from './utils/generate-dots';
import { mergeDots } from './utils/merge-dots';
import { ClickableAria } from './clickable-aria';
import { DEFAULT_DOT_SIZE } from './constants';
import { Grid } from './grid';
import { Rectangle } from './rectangle';
import { Stats } from './stats';

import styles from './index.module.css';
type Direction = 'up' | 'down' | 'left' | 'right';

type SnakePart = [number, number];
type Snake = [SnakePart, SnakePart];

const getNextTickSnake = (snake: Snake, direction: Direction, dots: Array<Array<0 | 1>>) => {
	const updatedSnake = [...snake];
	const [oldHead] = updatedSnake;
	const iIncMap = {
		up: -1,
		down: 1,
		right: 0,
		left: 0,
	};
	const jIncMap = {
		up: 0,
		down: 0,
		right: 1,
		left: -1,
	};

	const newHead = [oldHead[0] + iIncMap[direction], oldHead[1] + jIncMap[direction]];
	const outOfBorders =
		newHead[0] < 0 ||
		newHead[1] < 0 ||
		newHead[0] > dots.length - 1 ||
		newHead[1] > dots.length - 1;

	if (outOfBorders) {
		return {
			state: 'dead',
			self: snake,
		};
	}
	const isFood = dots[newHead[0]][newHead[1]] === 2;
	const isObstacle = dots[newHead[0]][newHead[1]] === 1;

	if (isObstacle) {
		return {
			state: 'dead',
			self: snake,
		};
	}

	if (isFood) {
		return {
			state: 'alive',
			self: [newHead, ...snake.slice(0, snake.length)],
		};
	}

	return {
		state: 'alive',
		self: [newHead, ...snake.slice(0, snake.length - 1)],
	};
};

export const App: FC = () => {
	const CANVAS_WIDTH = Math.trunc(700 / DEFAULT_DOT_SIZE) * DEFAULT_DOT_SIZE;
	const CANVAS_HEIGHT = Math.trunc(700 / DEFAULT_DOT_SIZE) * DEFAULT_DOT_SIZE;
	const midI = Math.trunc(CANVAS_WIDTH / DEFAULT_DOT_SIZE / 2) - 1;
	const midJ = Math.trunc(CANVAS_HEIGHT / DEFAULT_DOT_SIZE / 2) - 1;
	const defaultSnake = [
		[midI, midJ],
		[midI + 1, midJ],
		[midI + 2, midJ],
	];

	const defaultDots = (() => {
		const dots = generateDots({
			generateValue: () => 0,
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			size: DEFAULT_DOT_SIZE,
		});

		const fitted = dots
			.map((array, i) =>
				array.map((_, j) => {
					if (defaultSnake.some((item) => matches(item)([i, j]))) {
						return 1;
					}

					return dots[i][j];
				}),
			)
			.map((array, i, arr) =>
				array.map((_, j) => {
					if (matches([i, j])([10, 10])) {
						return 2;
					}

					return arr[i][j];
				}),
			);

		return mergeDots(fitted, dots);
	})();
	const [snake, setSnake] = useState<{ state: 'alive' | 'dead'; self: Snake }>({
		state: 'alive',
		self: defaultSnake,
	});
	const [direction, setDirection] = useState<Direction>('up');
	const [playState, setPlayState] = useState<'iddle' | 'playing'>('iddle');
	const [dotSize] = useState(DEFAULT_DOT_SIZE);
	const [dots, setDots] = useState(defaultDots);
	const timerRef = useRef();
	const tickButtonRef = useRef();

	const handleChangeDirection = (e: any) => {
		const directionByKey = {
			KeyA: 'left',
			KeyD: 'right',
			KeyS: 'down',
			KeyW: 'up',
		} as const;
		const oppositeDirection = {
			up: 'down',
			down: 'up',
			left: 'right',
			right: 'left',
		} as const;

		const code = e.code as 'KeyA' | 'KeyD' | 'KeyW' | 'KeyS';

		const isOppositeDirection = direction === oppositeDirection[directionByKey[code]];
		const isSameDirection = direction === directionByKey[code];

		if (isSameDirection || isOppositeDirection) {
			return;
		}
		setDirection(directionByKey[code]);
	};

	const handleToggle = () => {
		setPlayState((playState) => (playState === 'playing' ? 'iddle' : 'playing'));
	};

	const handleTick = () => {
		const { state, self: updatedSnake } = getNextTickSnake(snake.self, direction, dots);
		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((_, j) => {
				const currentCoords = [i, j];

				if (updatedSnake.some((item) => matches(item)(currentCoords))) {
					return 1;
				}
				if (dots[i][j] === 2) {
					return dots[i][j];
				}

				return 0;
			}),
		);
		const foodCount = dots.reduce(
			(acc, arr) => acc + arr.reduce((acc, item) => (item === 2 ? acc + 1 : acc), 0),
			0,
		);
		const newFoodCoords = dots.flat(0);

		setSnake({ state, self: updatedSnake });
		setDots(updatedDots);
	};

	useEffect(() => {
		if (snake.state === 'dead') {
			alert('Game over');
			setPlayState('iddle');
		}
	}, [snake.state]);

	useEffect(() => {
		if (playState === 'iddle') {
			clearInterval(timerRef.current);
			timerRef.current = null;
			setDots(defaultDots);
			setDirection('up');
			setSnake({
				state: 'alive',
				self: defaultSnake,
			});

			return;
		}

		if (playState === 'playing') {
			const timerId = setInterval(
				() => {
					tickButtonRef.current.click();
				},
				100,
				snake,
				dots,
			);

			timerRef.current = timerId;

			return;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playState]);

	const handleDotClick = (e: any) => {
		const { x: rawX, y: rawY } = e.data.global;
		const [x, y] = [rawX / dotSize, rawY / dotSize].map(Math.trunc);

		const updatedDots = dots.map((dotsArray, i) =>
			dotsArray.map((dotValue, j) => {
				if (x === j && y === i) {
					return dotValue === 0 ? 2 : 0;
				}

				return dotValue;
			}),
		);

		setDots(updatedDots);
	};

	const renderDot = ([i, j]: [number, number]) => {
		const dotValue = dots[i][j];

		if (dotValue === 0) {
			return null;
		}

		return (
			<Rectangle.Graphics
				key={ `${i}_${j}` }
				x={ j * dotSize }
				y={ i * dotSize }
				width={ dotSize }
				height={ dotSize }
				dotValue={ dotValue }
			/>
		);
	};

	return (
		<div className={ styles.app } onKeyPress={ handleChangeDirection }>
			<div className={ styles.canvas }>
				<Stats
					className={ styles.stats }
					canvasWidth={ CANVAS_WIDTH }
					canvasHeight={ CANVAS_HEIGHT }
					points={ snake.self.length }
				/>
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
					/>

					{dots.map((dotsArray, i) => dotsArray.map((_, j) => renderDot([i, j])))}

					<Grid width={ CANVAS_WIDTH } height={ CANVAS_HEIGHT } dotWidth={ dotSize } />
				</Stage>
			</div>
			<div className={ styles.controls }>
				<Button onClick={ handleToggle }>
					{playState === 'iddle' && 'Start'}
					{playState === 'playing' && 'Stop'}
				</Button>

				<Button ref={ tickButtonRef } onClick={ handleTick }>
					Tick
				</Button>
			</div>
		</div>
	);
};
