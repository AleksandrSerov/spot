import React from 'react';

import { Stage, Layer } from 'react-konva';
import { Map } from './components/map';

import styles from './app.module.css';
import { Player } from './components/player';
import { Grid } from './components/grid';

export const App: React.FC = () => {
	return (
		<Stage className={ styles.component } width={ window.innerWidth } height={ window.innerHeight }>
			<Layer>
				<Map>
					<Grid width={ 500 } height={ 500 } />
					<Player name='Creator' />
				</Map>
			</Layer>
		</Stage>
	);
};
