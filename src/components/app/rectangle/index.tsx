import { FC } from 'react';
import { Sprite } from '@inlet/react-pixi';

const bDotSpriteUrl = new URL('./black.png?width=20&height=20', import.meta.url);
const wDotSpriteUrl = new URL('./white.png?width=20&height=20', import.meta.url);

type Props = {
	x: number;
	y: number;
	width: number;
	height: number;
	alive: boolean;
	onClick: (e: any) => void;
	onMouseOver: (e: any) => void;
};

export const Rectangle: FC<Props> = ({ x, y, alive, onClick, onMouseOver, width }) => (
	<Sprite
		image={ alive ? bDotSpriteUrl.href : wDotSpriteUrl.href }
		scale={ { x: width / 20, y: width / 20 } }
		x={ x }
		y={ y }
		interactive={ true }
		pointerdown={ onClick }
		mouseover={ onMouseOver }
	/>
);
