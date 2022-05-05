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
			for (let i = dotWidth; i < height; i += dotWidth) {
				g.moveTo(0, i);
				g.lineTo(width, i);
				g.moveTo(i, 0);
				g.lineTo(i, height);
			}
		},
		[dotWidth, height, width],
	);

	return <Graphics x={ 0 } y={ 0 } draw={ draw } />;
};
