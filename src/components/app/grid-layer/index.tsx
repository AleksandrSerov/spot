import { FC, memo, useCallback } from 'react';
import { Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Color } from 'pixi.js';
type GridLayer = {
	width: number;
	height: number;
	dotWidth: number;
};

export const GridLayer: FC<GridLayer> = memo(({ width, height, dotWidth }) => {
	const draw = useCallback(
		(g: PIXI.Graphics) => {
			g.clear();
			g.lineStyle(1, new Color('black').toHex(), 0.3);
			g.beginFill(new Color('black').toHex());
			g.moveTo(0, 0);
			g.lineTo(width, 0);
			for (let x = dotWidth; x < height; x += dotWidth) {
				g.moveTo(0, x);
				g.lineTo(width, x);
			}
			for (let y = dotWidth; y < width; y += dotWidth) {
				g.moveTo(y, 0);
				g.lineTo(y, height);
			}
		},
		[dotWidth, height, width],
	);

	return <Graphics x={ 0 } y={ 0 } draw={ draw } />;
});

GridLayer.displayName = 'GridLayer';
