import { FC, useCallback } from 'react';
import { Graphics } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

type Props = {
	x: number;
	y: number;
	width: number;
	height: number;
	alive: boolean;
	onClick: () => void;
};

const blackColorCode = '#000000';
const whiteColorCode = '#ffffff';

export const Rectangle: FC<Props> = ({ x, y, alive, onClick, width }) => {
	const draw = useCallback(
		(g: PIXI.Graphics) => {
			g.clear();
			g.removeAllListeners();
			g.interactive = true;
			g.beginFill(string2hex(alive ? blackColorCode : whiteColorCode));
			g.drawRect(x, y, width, width);
			g.endFill();
			g.on('click', onClick);
		},
		[alive, x, y, width, onClick],
	);

	return <Graphics x={ x } y={ y } draw={ draw } />;
};
