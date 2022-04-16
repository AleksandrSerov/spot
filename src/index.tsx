import React from 'react';

import { App } from './app';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(<App />);
