import { Stage, Layer, Rect, Text, Circle, Line } from 'react-konva';
export const App: React.FC = () => {
	const handleClick = () => {
		console.log('click');
	};
	return (
		<Stage width={window.innerWidth} height={window.innerHeight}>
			<Layer>
				<Rect
					x={20}
					y={20}
					width={50}
					height={50}
					fill={'red'}
					shadowBlur={5}
					onClick={handleClick}
				/>
			</Layer>
		</Stage>
	);
};
