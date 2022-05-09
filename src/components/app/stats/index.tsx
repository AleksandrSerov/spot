import { VFC } from 'react';
import cn from 'classnames';

import styles from './index.module.css';

type Props = {
	tickCount: number;
	population: number;
	maxPopulation: number;
	canvasWidth: number;
	canvasHeight: number;
	className?: string;
};

export const Stats: VFC<Props> = ({
	tickCount,
	population,
	maxPopulation,
	canvasWidth,
	canvasHeight,
	className,
}) => (
	<div className={ cn(styles.stats, className) }>
		<div>Tick: {tickCount}</div>
		<div>Population: {population}</div>

		<div>Max population: {maxPopulation}</div>
		<div>
			Canvas size: {canvasWidth}px X {canvasHeight}px
		</div>
	</div>
);
