/* eslint-disable react/display-name */
import { FC, memo, useCallback } from 'react';
import { Graphics as PixiGraphics } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

import { RectangleProps } from '..';

const blackColorCode = '#000000';
const redColorCode = '#FF0000';

const colorByCode = {
	1: blackColorCode,
	2: redColorCode,
};

export const Graphics: FC<RectangleProps> = memo(
	({ x, y, width, height, dotValue, onClick, onMouseOver, onPointerDown }) => {
		const draw = useCallback(
			(g: PIXI.Graphics) => {
				g.clear();
				g.removeAllListeners();
				g.interactive = true;
				if (onMouseOver) {
					g.on('mouseover', onMouseOver);
				}
				if (onPointerDown) {
					g.on('pointerdown', onPointerDown);
				}
				if (onClick) {
					g.on('click', onClick);
				}
				g.beginFill(string2hex(colorByCode[dotValue]));
				g.drawRect(x, y, width, height);
				g.endFill();
			},
			[dotValue, height, onClick, onMouseOver, onPointerDown, width, x, y],
		);

		return <PixiGraphics x={ 0 } y={ 0 } draw={ draw } />;
	},
);
