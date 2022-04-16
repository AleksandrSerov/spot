import React, { useState } from 'react';
import { Group, Rect, Text } from 'react-konva';

type Props = {
	name: string;
};
export const Player: React.FC<Props> = ({ name }) => {
	const [size, setSize] = useState({ width: 5, height: 5 });

	const handleClick = () => {
		console.log('here');
		if (size.width > 100) {
			return;
		}

		setSize(({ width, height }) => {
			return {
				width: width + 1,
				height: height + 1,
			};
		});
	};

	return (
		<Group onClick={ handleClick }>
			<Rect width={ size.width } height={ size.height } fill='lightyellow' opacity={ 0.5 } />
		</Group>
	);
};
