import React from 'react';
import { createRoot } from 'react-dom/client';
import Stats from 'stats.js';

import { App } from './app';

import './index.module.css';

const stats = new Stats();

stats.showPanel(0);
document.body.appendChild(stats.dom);

function animate() {
	stats.begin();

	// monitored code goes here

	stats.end();

	requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);

root.render(<App />);
