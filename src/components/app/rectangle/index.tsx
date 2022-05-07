import { FC } from 'react';

import { Graphics } from './graphics';
import { Sprite } from './sprite';

export type RectangleProps = {
	x: number;
	y: number;
	width: number;
	height: number;
	alive: boolean;
	onClick: (e: any) => void;
	onMouseOver: (e: any) => void;
};

export const Rectangle: {
	Graphics: FC<RectangleProps>;
	Sprite: FC<RectangleProps>;
} = {
	Graphics,
	Sprite,
};
