/* eslint-disable react/display-name */
import { FC, memo, useCallback } from 'react';
import { Graphics as PixiGraphics } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

export type Props = {
	width: number;
	height: number;
	onClick: (e: any) => void;
	onMouseOver: (e: any) => void;
};

const blackColorCode = '#fffff';

export const ClickableAria: FC<Props> = memo(({ onClick, onMouseOver, width, height }) => {
	const draw = useCallback(
		(g: PIXI.Graphics) => {
			g.clear();
			g.removeAllListeners();
			g.interactive = true;
			g.beginFill(string2hex(blackColorCode));
			g.drawRect(0, 0, width, height);

			g.endFill();
			g.on('click', onClick);
			g.on('mouseover', onMouseOver);
		},
		[width, height, onClick, onMouseOver],
	);

	return <PixiGraphics x={ 0 } y={ 0 } draw={ draw } />;
});
