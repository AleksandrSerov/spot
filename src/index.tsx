import { useCallback, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Stats from 'stats.js';

import { App } from './app';

import './index.module.css';

const initStats = () => {
	const stats = new Stats();

	stats.showPanel(0);
	document.body.appendChild(stats.dom);

	const animate = () => {
		stats.begin();

		// monitored code goes here

		stats.end();

		requestAnimationFrame(animate);
	};

	requestAnimationFrame(animate);
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
process.env.NODE_ENV !== 'production' && initStats();

const root = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion

const WrappedApp = () => {
	const [, updateState] = useState();
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	//@ts-ignore
	const forceUpdate = useCallback(() => updateState({}), []);

	useEffect(() => {
		window.addEventListener('resize', forceUpdate);
	}, []);

	return <App />;
};

ReactDOM.render(<WrappedApp />, root);
