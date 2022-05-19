import { FC, useEffect, useRef, useState } from 'react';
import { applyDefaultProps, Stage } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import matches from 'lodash/matches';

import { getRandomInt } from '../../utils/get-random-int';
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
const FOOD_VALUE = 2;

const getRandomEmptyDotPoint = (dots: Array<Array<0 | 1>>) => {
	const coordsForRandom = dots
		.map((array, i) =>
			array.map((value, j) => {
				if (value === 0) {
					return [i, j];
				}

				return undefined;
			}),
		)
		.flat(1)
		.filter((v) => v);

	const point = coordsForRandom[getRandomInt(coordsForRandom.length)];

	return point as [number, number];
};

const getNextTickSnake = (
	snake: Snake,
	direction: Direction,
	dots: Array<Array<0 | 1>>,
	setFood: () => void,
) => {
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
	const isFood = dots[newHead[0]][newHead[1]] === FOOD_VALUE;

	const isObstacle = dots[newHead[0]][newHead[1]] === 1;

	if (isObstacle) {
		return {
			state: 'dead',
			self: snake,
		};
	}

	if (isFood) {
		setFood(null);

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

const CANVAS_WIDTH = Math.trunc(700 / DEFAULT_DOT_SIZE) * DEFAULT_DOT_SIZE;
const CANVAS_HEIGHT = Math.trunc(700 / DEFAULT_DOT_SIZE) * DEFAULT_DOT_SIZE;

const emptyDots = generateDots({
	generateValue: () => 0,
	width: CANVAS_WIDTH,
	height: CANVAS_HEIGHT,
	size: DEFAULT_DOT_SIZE,
});

export const App: FC = () => {
	const midI = Math.trunc(CANVAS_WIDTH / DEFAULT_DOT_SIZE / 2) - 1;
	const midJ = Math.trunc(CANVAS_HEIGHT / DEFAULT_DOT_SIZE / 2) - 1;
	const defaultSnake = [
		[midI, midJ],
		[midI + 1, midJ],
		[midI + 2, midJ],
		[midI + 3, midJ],
	];

	const defaultDots = (() => {
		const dots = emptyDots;

		defaultSnake.forEach(([i, j]) => {
			dots[i][j] = 1;
		});

		return mergeDots(dots, dots);
	})();

	const [snake, setSnake] = useState<{ state: 'alive' | 'dead'; self: Snake }>({
		state: 'alive',
		self: defaultSnake,
	});
	const [direction, setDirection] = useState<Direction>('up');
	const [playState, setPlayState] = useState<'iddle' | 'playing'>('iddle');
	const [dotSize] = useState(DEFAULT_DOT_SIZE);
	const [dots, setDots] = useState(defaultDots);
	const dotsRef = useRef(dots);
	const [food, setFood] = useState<null | [number, number]>(getRandomEmptyDotPoint(dots));
	const timerRef = useRef();

	useEffect(() => {
		dotsRef.current = dots;
	}, [dots]);
	const handleChangeDirection = (e: any) => {
		if (playState === 'iddle') {
			setPlayState('playing');
		}
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

		const newDirection = directionByKey[code];

		const isOppositeDirection = direction === oppositeDirection[newDirection];
		const isSameDirection = direction === newDirection;

		const nextDotTheOwnBody =
			getNextTickSnake(snake.self, direction, dots, setFood).self[0] === snake.self[1];

		if (isSameDirection || isOppositeDirection) {
			return;
		}
		if (nextDotTheOwnBody) {
			return;
		}
		setDirection(newDirection);
		handleTick();
	};

	const handleTick = () => {
		setSnake((prevSnake) => {
			const { state, self: updatedSnake } = getNextTickSnake(
				prevSnake.self,
				direction,
				dotsRef.current,
				setFood,
			);

			return { state, self: updatedSnake };
		});
	};

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
			clearInterval(timerRef.current);
			const timerId = setInterval(handleTick, 100);

			timerRef.current = timerId;

			return;
		}
	}, [playState, direction]);

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

	useEffect(() => {
		if (food === null) {
			setFood(getRandomEmptyDotPoint(dots));

			return;
		}

		const nextDots = generateDots({
			generateValue: () => 0,
			width: CANVAS_WIDTH,
			height: CANVAS_HEIGHT,
			size: DEFAULT_DOT_SIZE,
		});

		snake.self.forEach((snakeBody) => {
			const [i, j] = snakeBody;

			nextDots[i][j] = 1;
		});

		const [foodI, foodJ] = food;

		nextDots[foodI][foodJ] = 2;
		setDots(nextDots);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [food, snake.self]);

	useEffect(() => {
		if (snake.state === 'dead') {
			alert('Game over');
			setPlayState('iddle');
		}
	}, [snake.state]);

	useEffect(() => {
		window.addEventListener('keypress', handleChangeDirection);

		return () => window.removeEventListener('keypress', handleChangeDirection);
	});

	return (
		<div className={ styles.app }>
			<div className={ styles.canvas }>
				<Stats
					className={ styles.stats }
					canvasWidth={ CANVAS_WIDTH }
					canvasHeight={ CANVAS_HEIGHT }
					points={ snake.self.length - 3 }
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
			<div className={ styles.controls }>{playState}</div>
		</div>
	);
};
