import { VFC } from 'react';

import styles from './index.module.css';

type Props = {
	tickCount: number;
	population: number;
	maxPopulation: number;
	canvasWidth: number;
	canvasHeight: number;
};

export const Stats: VFC<Props> = ({
	tickCount,
	population,
	maxPopulation,
	canvasWidth,
	canvasHeight,
}) => (
	<div className={ styles.stats }>
		<div>Tick: {tickCount}</div>
		<div>Population: {population}</div>

		<div>Max population: {maxPopulation}</div>
		<div>
			Canvas size: {canvasWidth}px X {canvasHeight}px
		</div>
	</div>
);
