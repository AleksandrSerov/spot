/* eslint-disable react/display-name */
import { FC, memo } from 'react';
import { Sprite as PixiSprite } from '@inlet/react-pixi';

import { RectangleProps } from '..';

const bDotSpriteUrl = new URL('./black.png?width=20&height=20', import.meta.url);

export const Sprite: FC<RectangleProps> = memo(({ x, y, width }) => (
	<PixiSprite image={ bDotSpriteUrl.href } scale={ { x: width / 20, y: width / 20 } } x={ x } y={ y } />
));
