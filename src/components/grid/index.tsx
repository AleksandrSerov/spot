import React from 'react';
import { Group, Line } from 'react-konva';

type Props = {
	width: number;
	height: number;
	visible?: boolean;
};

export const Grid: React.FC<Props> = ({ width, height, visible = true }) => {
	const generateH = () =>
		new Array(250).fill(undefined).map((item, index) => {
			const y = index * 2;
			return {
				points: [0, y, width, y],
			};
		});

	const generateV = () =>
		new Array(250).fill(undefined).map((item, index) => {
			const x = index * 2;
			return {
				points: [x, 0, x, height],
			};
		});
	const lines = [...generateH(), ...generateV()];
	return (
		<Group visible={ visible }>
			{lines.map(({ points }) => (
				<Line
					opacity={ 0.1 }
					key={ `${points[0]}_${points[2]}` }
					points={ points }
					stroke='blue'
					strokeWidth={ 1 }
				/>
			))}
		</Group>
	);
};
