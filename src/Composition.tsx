import React, {useEffect, useState} from 'react';
import {
	AbsoluteFill,
	Audio,
	staticFile,
	continueRender,
	delayRender,
	Sequence,
	useVideoConfig,
	useCurrentFrame,
	interpolate,
} from 'remotion';

// Imports des composants
import {GlobalStyles} from './GlobalStyles';
import {BackgroundSequencer} from './components/BackgroundSequencer';
import {LyricsRenderer} from './components/LyricsRenderer';
import {Windows95Widgets} from './components/Windows95Widgets';
import {VaporwaveOverlay} from './components/VaporwaveOverlay';
import {Credits} from './components/Credits';
import {TerminalIntro} from './components/TerminalIntro';
import {parseSrt, LyricLine} from './utils/srtParser';

export const MyComposition: React.FC = () => {
	const [subtitles, setSubtitles] = useState<LyricLine[]>([]);
	const [handle] = useState(() => delayRender());
	const {fps} = useVideoConfig();
	const frame = useCurrentFrame();

	// --- TIMING AJUSTÉ ---
	// L'intro dure 380 frames (le temps de taper tout le texte)
	const introDuration = 380;

	// La musique démarre EXACTEMENT quand l'intro finit
	const musicStartFrame = introDuration;
	const musicDuration = 136 * fps; // ~2min16

	// Chargement du SRT
	useEffect(() => {
		fetch(staticFile('02_LYRICS/luther_merci_final.srt'))
			.then((res) => res.text())
			.then((text) => {
				const parsed = parseSrt(text);
				setSubtitles(parsed);
				continueRender(handle);
			})
			.catch((err) => {
				console.error(err);
				continueRender(handle);
			});
	}, [handle]);

	// Calcul de l'opacité du Flash de transition
	// Le flash commence à musicStartFrame et dure 10 frames
	const flashOpacity = interpolate(
		frame,
		[musicStartFrame, musicStartFrame + 5, musicStartFrame + 10],
		[0, 1, 0],
		{extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
	);

	return (
		<AbsoluteFill style={{backgroundColor: 'black'}}>
			<GlobalStyles />

			{/* 1. INTRO TERMINAL (S'arrête net à musicStartFrame) */}
			<Sequence from={0} durationInFrames={introDuration}>
				<TerminalIntro />
				{/* Bruit de cassette juste avant la fin (2 secondes avant la transition) */}
				<Sequence from={introDuration - 48}>
					<Audio src={staticFile('06_SFX/vhs_tape_insert.wav')} />
				</Sequence>
			</Sequence>

			{/* 2. LE CLIP (Démarre pile à la fin de l'intro) */}
			<Sequence from={musicStartFrame} durationInFrames={musicDuration}>
				<Audio src={staticFile('01_AUDIO/luther_merci.mp3')} />

				<BackgroundSequencer />
				<Windows95Widgets />
				<LyricsRenderer subtitles={subtitles} />

				{/* --- LA TOUCHE ULTIME : INTERFACE CAMÉSCOPE --- */}
				{/* Ces éléments sont ajoutés AVANT l'overlay pour subir les glitchs aussi */}
				<div
					style={{
						position: 'absolute',
						top: 60,
						left: 60,
						fontFamily: 'VCR_OSD, monospace',
						color: 'white',
						fontSize: 50,
						opacity: 0.8,
						textShadow: '2px 2px 0 #000',
						pointerEvents: 'none',
					}}
				>
					PLAY ►
				</div>

				<div
					style={{
						position: 'absolute',
						bottom: 60,
						left: 60,
						fontFamily: 'VCR_OSD, monospace',
						color: 'white',
						fontSize: 40,
						opacity: 0.8,
						textShadow: '2px 2px 0 #000',
						pointerEvents: 'none',
					}}
				>
					SP 0:00:00
				</div>
				{/* ----------------------------------------------- */}

				{/* L'overlay applique les effets sur tout ce qui précède (y compris le texte PLAY) */}
				<VaporwaveOverlay />
			</Sequence>

			{/* 3. CRÉDITS (Démarre après la fin de la musique) */}
			<Sequence from={musicStartFrame + musicDuration}>
				<Credits />
				<Audio
					volume={0.5}
					src={staticFile('06_SFX/win95_startup_sound.wav')}
				/>
			</Sequence>

			{/* 4. TRANSITION FLASH BLANC (Au dessus de tout pour cacher la coupure) */}
			<AbsoluteFill
				style={{
					backgroundColor: 'white',
					opacity: flashOpacity,
					pointerEvents: 'none',
					mixBlendMode: 'overlay', // Mode de fusion pour un éclat lumineux intense
				}}
			/>
		</AbsoluteFill>
	);
};