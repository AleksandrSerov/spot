import ReactDOM from 'react-dom';
import Stats from 'stats.js';

import { App } from './app';

import './index.module.css';

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

const root = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion

ReactDOM.render(<App />, root);
