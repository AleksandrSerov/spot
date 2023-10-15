import { FC } from 'react';

import { Sprite } from './sprite';

export type RectangleProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	onClick: (e: any) => void;
	onMouseOver: (e: any) => void;
	onPointerDown: (e: any) => void;
};

export const Rectangle: {
	Sprite: FC<RectangleProps>;
} = {
	Sprite,
};
