import React from 'react';
import { Group, Line } from 'react-konva';

type Props = {
	width: number;
	height: number;
};

export const Grid: React.FC<Props> = ({ width, height }) => {
	const generateH = () => {
		return new Array(250).fill(undefined).map((item, index) => {
			const y = index * 2;
			return {
				points: [0, y, width, y],
			};
		});
	};
	const generateV = () => {
		return new Array(250).fill(undefined).map((item, index) => {
			const x = index * 2;
			return {
				points: [x, 0, x, height],
			};
		});
	};
	const lines = [...generateH(), ...generateV()];
	return (
		<Group>
			{lines.map(({ points }) => (
				<Line
					opacity={ 0.1 }
					key={ points[0] + points[1] }
					points={ points }
					stroke='blue'
					strokeWidth={ 1 }
				/>
			))}
		</Group>
	);
};
