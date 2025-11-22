import React from 'react';
import {
	AbsoluteFill,
	Sequence,
	Video,
	staticFile,
	useVideoConfig,
	interpolate,
	Easing,
	useCurrentFrame, // <--- C'est l'import critique qui manquait peut-être
} from 'remotion';

const VIDEO_FILES = [
	'tokyo.mp4',
	'90s_anime_scenery.mp4',
	'vaporwave_sunset_grid.mp4',
	'japan.mp4',
	'retro_terminal.mp4',
	'tokyo_walking.mp4',
	'vending_machine (1).mp4',
	'video_game.mp4',
	'vhsmall.mp4',
	'vending_machine (2).mp4',
	'tokyo.mp4',
	'japan.mp4', // Répétition pour combler la durée
];

// 1. Le composant principal qui gère la playlist
export const BackgroundSequencer: React.FC = () => {
	const {fps} = useVideoConfig();
	const clipDuration = 12 * fps; // 12 secondes par clip

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			{VIDEO_FILES.map((fileName, index) => {
				const startFrame = index * clipDuration;

				return (
					<Sequence
						key={index}
						from={startFrame}
						durationInFrames={clipDuration}
					>
						{/* On enveloppe la vidéo dans notre Wrapper de transition */}
						<TransitionWrapper>
							<Video
								src={staticFile(`03_VIDEO_LOOPS/${fileName}`)}
								style={{
									width: '100%',
									height: '100%',
									objectFit: 'cover',
								}}
								muted
								loop
							/>
						</TransitionWrapper>
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

// 2. Le composant interne pour l'effet "Zoom/Flash"
// Il doit être défini EN DEHORS de la fonction BackgroundSequencer, mais dans le même fichier
const TransitionWrapper: React.FC<{children: React.ReactNode}> = ({
	children,
}) => {
	// useCurrentFrame ici renverra 0 au début de CHAQUE clip (grâce au <Sequence> au-dessus)
	const frame = useCurrentFrame();

	// Effet : Zoom rapide (1.2 -> 1.0) sur 10 frames
	const scale = interpolate(frame, [0, 20], [1.1, 1], {
		easing: Easing.out(Easing.exp),
		extrapolateRight: 'clamp',
	});

	// Effet : Flou cinétique qui disparaît (Motion Blur simulé)
	const blur = interpolate(frame, [0, 10], [10, 0], {
		extrapolateRight: 'clamp',
	});

	// Effet : Flash lumineux (Brightness)
	const brightness = interpolate(frame, [0, 10], [1.5, 1], {
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				width: '100%',
				height: '100%',
				transform: `scale(${scale})`,
				filter: `blur(${blur}px) brightness(${brightness})`,
			}}
		>
			{children}
		</div>
	);
};