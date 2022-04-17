import React, { useState } from 'react';
import { Rect } from 'react-konva';

type Props = {
	startPos?: { x: number; y: number };
};

export const Cell: React.FC<Props> = ({ startPos = { x: 0, y: 0 } }) => {
	const [size, setSize] = useState({ width: 1, height: 1 });
	const [pos] = useState(startPos);

	const handleClick = () => {
		console.log('here');
		if (size.width > 100) {
			return;
		}

		setSize(({ width, height }) => ({
			width: width + 1,
			height: height + 1,
		}));
	};

	return (
		<Rect
			onClick={ handleClick }
			x={ pos.x }
			y={ pos.y }
			width={ size.width }
			height={ size.height }
			fill='lightyellow'
			opacity={ 0.5 }
		/>
	);
};
