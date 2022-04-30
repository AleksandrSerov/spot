/* eslint-disable react/no-multi-comp */
/* eslint-disable react/react-in-jsx-scope */
// Threejs example: threejs.org/examples/?q=asc#webgl_effects_ascii
import { useEffect, useMemo, useRef, useState } from 'react';
import { OrbitControls, useCursor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AsciiEffect } from 'three-stdlib';

export const App = () => (
	<Canvas>
		<color attach='background' args={ ['black'] } />
		<spotLight position={ [10, 10, 10] } angle={ 0.15 } penumbra={ 1 } />
		<pointLight position={ [-10, -10, -10] } />
		<Torusknot />
		<OrbitControls />
		<AsciiRenderer invert={ true } />
	</Canvas>
);

const Torusknot = (props) => {
	const ref = useRef();
	const [clicked, click] = useState(false);
	const [hovered, hover] = useState(false);

	useCursor(hovered);
	useFrame((state, delta) => (ref.current.rotation.x = ref.current.rotation.y += delta / 2));

	return (
		<mesh
			{ ...props }
			ref={ ref }
			scale={ clicked ? 1.5 : 1.25 }
			onClick={ () => click(!clicked) }
			onPointerOver={ () => hover(true) }
			onPointerOut={ () => hover(false) }
		>
			<torusKnotGeometry args={ [1, 0.3, 256, 64] } />
			<meshStandardMaterial color='orange' />
		</mesh>
	);
};

const AsciiRenderer = ({ renderIndex = 1, characters = ' .:-+*=%@#', ...options }) => {
	// Reactive state
	const { size, gl, scene, camera } = useThree();

	// Create effect
	const effect = useMemo(() => {
		const effect = new AsciiEffect(gl, characters, options);

		effect.domElement.style.position = 'absolute';
		effect.domElement.style.top = '0px';
		effect.domElement.style.left = '0px';
		effect.domElement.style.color = 'white';
		effect.domElement.style.backgroundColor = 'lightgray';
		effect.domElement.style.pointerEvents = 'none';

		return effect;
	}, [characters, options.invert]);

	// Append on mount, remove on unmount
	useEffect(() => {
		gl.domElement.parentNode.appendChild(effect.domElement);

		return () => gl.domElement.parentNode.removeChild(effect.domElement);
	}, [effect]);

	// Set size
	useEffect(() => {
		effect.setSize(size.width, size.height);
	}, [effect, size]);

	// Take over render-loop (that is what the index is for)
	useFrame((state) => {
		effect.render(scene, camera);
	}, renderIndex);

	return null;

	// This component returns nothing, it has no view, it is a purely logical
};
