import React from 'react';
import { MapControls, OrthographicCamera, Plane, RoundedBox, Sphere } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';

export const Map = () => (
	<Canvas>
		<OrthographicCamera makeDefault={ true } position={ [0, 0, 10] } zoom={ 1 } />
		<MapControls
			maxZoom={ 2 }
			minZoom={ 0.5 }
			maxAzimuthAngle={ 0 }
			minAzimuthAngle={ 0 }
			minPolarAngle={ Math.PI / 2 }
			maxPolarAngle={ Math.PI / 2 }
		/>
		<RoundedBox
			args={ [window.innerWidth / 4, window.innerWidth / 4, 50] }
			radius={ 40 }
			smoothness={ 4 }
		>
			<meshPhongMaterial color='#f3f3f3' wireframe={ true } />
		</RoundedBox>
		<Plane args={ [window.innerWidth / 4, window.innerWidth / 4] } />
	</Canvas>
);
