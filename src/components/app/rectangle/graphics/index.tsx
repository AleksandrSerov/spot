/* eslint-disable react/display-name */
import { FC, memo, useCallback } from 'react';
import { Graphics as PixiGraphics } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

import { RectangleProps } from '..';

const blackColorCode = '#000000';

export const Graphics: FC<RectangleProps> = memo(
	({ x, y, width, height, onClick, onMouseOver, onPointerDown }) => {
		const draw = useCallback(
			(g: PIXI.Graphics) => {
				g.clear();
				g.removeAllListeners();
				g.interactive = true;
				g.on('mouseover', onMouseOver);
				g.on('pointerdown', onPointerDown);
				g.on('click', onClick);
				g.beginFill(string2hex(blackColorCode));
				g.drawRect(x, y, width, height);
				g.endFill();
			},
			[height, onClick, onMouseOver, onPointerDown, width, x, y],
		);

		return <PixiGraphics x={ 0 } y={ 0 } draw={ draw } />;
	},
);
