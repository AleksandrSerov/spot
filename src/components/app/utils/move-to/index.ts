type Args = {
	offset: number;
	axis: 'x' | 'y';
	direction: 1 | -1;
};

export const moveTo =
	({ axis, direction, offset }: Args) =>
		(dotsArray: Array<0 | 1>, i: number, dots: Array<Array<0 | 1>>) => {
			const movedDots = dotsArray.map((_, j) => {
				const xOffest = axis === 'x' ? j - direction * offset : j;
				const yOffest = axis === 'y' ? i - direction * offset : i;

				return dots[yOffest]?.[xOffest] ?? 0;
			});

			return movedDots;
		};
