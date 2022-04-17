import React from 'react';
import { Layer, Stage } from 'react-konva';

import { Map } from './components/map';
import { Cell } from './components/player';

import styles from './app.module.css';

const generateCells = () => {
	const cells = [];

	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			const pos = [i, j];

			cells.push(pos);
		}
	}

	return cells;
};

const sells = generateCells();

export const App: React.FC = () => (
	<Stage className={ styles.component } width={ window.innerWidth } height={ window.innerHeight }>
		<Layer>
			<Map>
				{/* <Grid width={ 500 } height={ 500 } visible={ false } /> */}
				{sells.map(([x, y], index) => (
					<Cell key={ `${x}_${y}` } startPos={ { x, y } } />
				))}
			</Map>
		</Layer>
	</Stage>
);
