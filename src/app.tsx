import React from 'react';

import { Stage, Layer } from 'react-konva';
import { Map } from './components/map';
export const App: React.FC = () => {
	return (
		<Stage width={ window.innerWidth } height={ window.innerHeight }>
			<Layer>
				<Map />
			</Layer>
		</Stage>
	);
};
