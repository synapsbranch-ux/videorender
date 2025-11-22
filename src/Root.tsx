import {Composition} from 'remotion';
import {MyComposition} from './Composition';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="LutherMerciVideo"
				component={MyComposition}
				durationInFrames={3900} 
				fps={24}
				width={1920}
				height={1080}
			/>
		</>
	);
};