import { FC, memo, useCallback } from 'react';
import { Graphics as PixiGraphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Color } from 'pixi.js';

const blackColorCode = '#000000';

export type DotsLayer = {
	width: number;
	height: number;
	matrix: Array<Array<0 | 1>>;
};
export const DotsLayer: FC<DotsLayer> = memo(({ matrix, width, height }) => {
	const draw = useCallback(
		(g: PIXI.Graphics) => {
			g.clear();

			g.beginFill(new Color(blackColorCode).toHex());
			matrix.forEach((dotsArray, i) => {
				dotsArray.forEach((value, j) => {
					if (value === 0) {
						return;
					}
					g.drawRect(j * width, i * height, width, height);
				});
			});
			g.endFill();
		},
		[height, matrix, width],
	);

	return <PixiGraphics x={ 0 } y={ 0 } draw={ draw } />;
});

DotsLayer.displayName = 'DotsLayer';
