import { FC, memo, useCallback } from 'react';
import { Graphics as PixiGraphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { Color } from 'pixi.js';
export type Props = {
	width: number;
	height: number;
	onClick: (e: any) => void;
	onMouseOver: (e: any) => void;
	onPointerDown: (e: any) => void;
};

export const ClickableLayer: FC<Props> = memo(
	({ onClick, onMouseOver, width, height, onPointerDown }) => {
		const draw = useCallback(
			(g: PIXI.Graphics) => {
				g.clear();
				g.eventMode = 'static';
				g.removeAllListeners();
				g.beginFill(new Color('#3ceee5').toHex());
				g.drawRect(0, 0, width, height);

				g.endFill();
				g.on('click', onClick);
				g.on('mousemove', onMouseOver);
				g.on('pointerdown', onPointerDown);
			},
			[width, height, onClick, onMouseOver, onPointerDown],
		);

		return <PixiGraphics x={ 0 } y={ 0 } draw={ draw } />;
	},
);

ClickableLayer.displayName = 'ClickableLayer';
