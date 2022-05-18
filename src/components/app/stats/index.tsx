import { VFC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type Props = {
	canvasWidth: number;
	canvasHeight: number;
	className?: string;
	points: number;
};

export const Stats: VFC<Props> = ({ canvasWidth, canvasHeight, points, className }) => (
	<div className={ cn(styles.stats, className) }>
		<div>
			Canvas size: {canvasWidth}px X {canvasHeight}px
		</div>
		<div>Points: {points}</div>
	</div>
);
