export const mergeDots = (dots1: Array<Array<0 | 1>>, dots2: Array<Array<0 | 1>>) =>
	dots1.map((dotsArray, i) =>
		dotsArray.map((_, j) => {
			if (dots1[i][j] === 1) {
				return 1;
			}
			if (dots1[i][j] === 0) {
				return dots2[i][j];
			}

			return dots1[i][j];
		}),
	);
