/* eslint-disable react/display-name */
import { FC, memo, useCallback } from 'react';
import { Graphics as PixiGraphics, useApp } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

export type Props = {
	width: number;
	height: number;
	onClick?: (e: any) => void;
	onMouseOver?: (e: any) => void;
	onPointerDown?: (e: any) => void;
};

const blackColorCode = '#fffff';

export const ClickableAria: FC<Props> = memo(
	({ onClick, onMouseOver, width, height, onPointerDown }) => {
		const app = useApp();

		app.renderer.plugins.interaction.moveWhenInside = true;

		const draw = useCallback(
			(g: PIXI.Graphics) => {
				g.clear();
				g.removeAllListeners();
				g.interactive = true;
				g.beginFill(string2hex(blackColorCode));
				g.drawRect(0, 0, width, height);

				g.endFill();
				if (onClick) {
					g.on('click', onClick);
				}
				if (onMouseOver) {
					g.on('mousemove', onMouseOver);
				}
				if (onPointerDown) {
					g.on('pointerdown', onPointerDown);
				}
			},
			[width, height, onClick, onMouseOver, onPointerDown],
		);

		return <PixiGraphics x={ 0 } y={ 0 } draw={ draw } />;
	},
);
