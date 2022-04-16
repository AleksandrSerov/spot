import React from 'react';

import { Rect } from 'react-konva';

export const Map: React.FC = () => {
	const handleClick = () => {
		console.log('here');
	};

	return (
		<Rect
			x={ 20 }
			y={ 20 }
			width={ 500 }
			height={ 500 }
			fill='gray'
			shadowBlur={ 5 }
			onClick={ handleClick }
		/>
	);
};
