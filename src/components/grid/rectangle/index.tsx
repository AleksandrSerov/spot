import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Graphics } from '@inlet/react-pixi';
import { string2hex } from '@pixi/utils';
import * as PIXI from 'pixi.js';

type Props = {
	x: number;
	y: number;
	width: number;
	height: number;
};

const blackColorCode = '#000000';
const whiteColorCode = '#ffffff';

export const Rectangle: FC<Props> = ({ x, y }) => {
	const [color, setColor] = useState(whiteColorCode);
	const handleClick = useCallback(() => {
		setColor((prevColor) => {
			console.log(prevColor);

			if (prevColor === blackColorCode) {
				return whiteColorCode;
			}

			return blackColorCode;
		});
	}, [setColor]);

	const draw = useCallback(
		(g: PIXI.Graphics) => {
			g.removeAllListeners();
			g.clear();
			g.interactive = true;
			g.beginFill(string2hex(color));
			g.drawRect(x, y, 10, 10);
			g.endFill();
			g.on('click', handleClick);
		},
		[color],
	);

	return <Graphics x={ x } y={ y } draw={ draw } />;
};
