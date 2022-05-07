import { FC, useCallback } from 'react';
import { Graphics } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

type Props = {
	width: number;
	height: number;
	dotWidth: number;
};

export const Grid: FC<Props> = ({ width, height, dotWidth }) => {
	const draw = useCallback(
		(g: PIXI.Graphics) => {
			g.clear();
			g.lineStyle(1, string2hex('black'), 0.3);
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
};
