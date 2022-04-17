import React, { useEffect, useRef, useState } from 'react';
import { Group, Rect } from 'react-konva';

type Direction = 'right' | 'left' | 'up' | 'down';
type DirectionKey = 'ArrowRight' | 'ArrowLeft' | 'ArrowDown' | 'ArrowUp';

const directionByButton = {
	ArrowRight: 'right' as const,
	ArrowLeft: 'left' as const,
	ArrowUp: 'up' as const,
	ArrowDown: 'down' as const,
};

const getXBound = (pos: number) => {
	if (pos < 0) {
		return 0;
	}

	if (pos > window.innerWidth - 500) {
		return window.innerWidth - 500;
	}

	return pos;
};

const getYBound = (pos: number) => {
	if (pos < 0) {
		return 0;
	}

	if (pos > window.innerHeight - 500) {
		return window.innerHeight - 500;
	}

	return pos;
};

export const Map: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const shapeRef = useRef(null);
	const [x, setX] = useState(window.innerWidth / 2 - 250);
	const [y, setY] = useState(window.innerHeight / 2 - 250);
	const [scale, setScale] = useState({ x: 100, y: 100 });

	const funcByDirection = {
		right: () => {
			setX((prevX) => prevX + 20);
		},
		left: () => {
			setX((prevX) => prevX - 20);
		},
		up: () => {
			setY((prevY) => prevY - 20);
		},
		down: () => {
			setY((prevY) => prevY + 20);
		},
	};

	const handleMove = (direction: Direction) => {
		const executeMove = funcByDirection[direction];

		executeMove();
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		const { key } = e;
		if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(key)) {
			const direction = directionByButton[key as DirectionKey];

			handleMove(direction);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const handleDragMove = (position) => ({
		x: getXBound(position.x),
		y: getYBound(position.y),
	});

	const handleWheel = (e) => {
		e.evt.preventDefault();
		const oldScale = scale.x;
		// const target = e.target;
		// const stage = e.target.getStage();
		// const pointer = stage.getPointerPosition();

		// const mousePointTo = {
		// 	x: (pointer.x - target.x()) / oldScale,
		// 	y: (pointer.y - target.y()) / oldScale,
		// };

		// how to scale? Zoom in? Or zoom out?
		let direction = e.evt.deltaY > 0 ? 1 : -1;

		// when we zoom on trackpad, e.evt.ctrlKey is true
		// in that case lets revert direction
		if (e.evt.ctrlKey) {
			direction = -direction;
		}

		const scaleByValue = 1.05;
		const scaleBy = direction > 0 ? scaleByValue : 1 / scaleByValue;

		const newScale = oldScale * scaleBy;
		const limited = direction > 0 ? Math.min(100, newScale) : Math.max(0.01, newScale);
		setScale({ x: limited, y: limited });

		// const newPos = {
		// 	x: pointer.x - mousePointTo.x * limited,
		// 	y: pointer.y - mousePointTo.y * limited,
		// };

		// e.target.position(newPos);
	};

	const handleDragEnd = (e) => {
		const { attrs } = e.target;
		setX(attrs.x);
		setY(attrs.y);
	};

	return (
		<Group
			x={ x }
			y={ y }
			ref={ shapeRef }
			draggable
			width={ 500 }
			height={ 500 }
			onWheel={ handleWheel }
			scale={ scale }
			onDragEnd={ handleDragEnd }
			dragBoundFunc={ handleDragMove }
		>
			<Group width={ 500 } height={ 500 }>
				<Rect width={ 500 } height={ 500 } shadowBlur={ 5 } fill='gray' />
				{children}
			</Group>
		</Group>
	);
};
