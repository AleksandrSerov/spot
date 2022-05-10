import React, { useState } from 'react';

import styles from './index.module.css';
const b3 = new URL('./img/b3.png?width=60&height=60', import.meta.url);
const b3_1 = new URL('./img/b3-1.png?width=60&height=60', import.meta.url);
const s23 = new URL('./img/s23.png?width=60&height=60', import.meta.url);
const s23_1 = new URL('./img/s23_1.png?width=60&height=60', import.meta.url);

export const Help = () => {
	const [showExplanation, setShowExplanation] = useState(false);

	return (
		<React.Fragment>
			<button className={ styles.explanationButton } onClick={ () => setShowExplanation(true) }>
				?
			</button>
			{showExplanation && (
				<div className={ styles.explanationContent }>
					<button className={ styles.close } onClick={ () => setShowExplanation(false) }>
						X
					</button>
					<div className={ styles.title }>Game of Life Explanation</div>
					<div className={ styles.description }>
						The Game of Life is not your typical computer game. It is a cellular
						automaton, and was invented by Cambridge mathematician John Conway.
					</div>
					<div className={ styles.description }>
						This game became widely known when it was mentioned in an article published
						by Scientific American in 1970. It consists of a grid of cells which, based
						on a few mathematical rules, can live, die or multiply. Depending on the
						initial conditions, the cells form various patterns throughout the course of
						the game.
					</div>
					<div className={ styles.subtitle }>Rules(default - B3/S23)</div>
					<div className={ styles.rules }>
						<div>Each cell with 2 or 3 neighbors survives.</div>
						<div className={ styles.example }>
							<img src={ s23.href } />
							-&gt;
							<img src={ s23_1.href } />
						</div>
						<div>Each cell with 3 neighbors becomes populated.</div>
						<div className={ styles.example }>
							<img src={ b3.href } />
							-&gt;
							<img src={ b3_1.href } />
						</div>
						<div>
							Each cell with &lt;=1 neighbors dies, as if by solitude.
							<br /> Each cell with &gt;=4 neighbors dies, as if by overpopulation.
						</div>
						<div className={ styles.example }> </div>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};
