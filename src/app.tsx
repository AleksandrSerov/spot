import React from 'react';

import { Stage, Layer } from 'react-konva';
import { Map } from './components/map';

import styles from './app.module.css';

export const App: React.FC = () => {
	return (
		<Stage className={ styles.component } width={ window.innerWidth } height={ window.innerHeight }>
			<Layer>
				<Map />
			</Layer>
		</Stage>
	);
};
