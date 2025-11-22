import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import {LyricLine} from '../utils/srtParser';

interface LyricsRendererProps {
	subtitles: LyricLine[];
}

export const LyricsRenderer: React.FC<LyricsRendererProps> = ({subtitles}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const currentTime = frame / fps;

	// 1. Trouver la ligne active
	const currentSubtitle = subtitles.find(
		(line) => currentTime >= line.startSeconds && currentTime <= line.endSeconds
	);

	if (!currentSubtitle) return null;

	// Calcul depuis combien de frames cette ligne est affichée
	const lineStartFrame = currentSubtitle.startSeconds * fps;
	const frameInLine = frame - lineStartFrame;

	// Découpage en lettres (y compris les espaces)
	const letters = currentSubtitle.text.split('');

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'flex-end',
				alignItems: 'center',
				paddingBottom: '120px', // On remonte un peu pour laisser la place aux reflets
				perspective: '1000px', // Active la 3D CSS
			}}
		>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					maxWidth: '85%',
					gap: '5px', // Espacement entre les lettres
				}}
			>
				{letters.map((char, i) => {
					// 2. LOGIQUE DU STAGGER (Décalage progressif)
					// Chaque lettre apparaît 3 frames après la précédente
					const delay = i * 2; 
					
					// Animation de ressort (Pop)
					const spr = spring({
						frame: frameInLine - delay,
						fps,
						config: {
							damping: 12, // Rebondissement contrôlé
							stiffness: 200, // Vitesse d'arrivée
						},
					});

					// Si l'animation n'a pas commencé pour cette lettre, on la cache
					if (frameInLine < delay) return null;

					// Animation d'Opacité et de Position (Slide Up)
					const translateY = interpolate(spr, [0, 1], [50, 0]);
					const opacity = interpolate(spr, [0, 1], [0, 1]);
                    
                    // Gestion des espaces pour qu'ils aient une largeur
                    if (char === ' ') {
                        return <span key={i} style={{width: 20}} />;
                    }

					return (
						<span
							key={i}
							style={{
								fontFamily: 'VCR_OSD, monospace',
								fontSize: '70px',
								fontWeight: 'bold', // Gras demandé
								color: 'white',
								display: 'inline-block',
								lineHeight: '1',
								
                                // L'animation dynamique
								transform: `translateY(${translateY}px) scale(${spr}) rotateX(10deg)`,
								opacity: opacity,

                                // 3. LE STYLE "REFLET & PERSPECTIVE" (Extrusion Néon)
                                // On empile les ombres pour créer de l'épaisseur vers l'arrière
								textShadow: `
                                    /* Contour noir pour lisibilité */
                                    2px 2px 0px #000,
                                    -1px -1px 0px #000,
                                    
                                    /* Extrusion 3D (Rose vers Violet) */
                                    0px 1px 0px #c64fbd,
                                    0px 2px 0px #c64fbd,
                                    0px 3px 0px #c64fbd,
                                    0px 4px 0px #8e44ad,
                                    0px 5px 0px #8e44ad,
                                    
                                    /* Glow Néon derrière */
                                    0px 0px 20px rgba(255, 113, 206, 0.8),
                                    0px 10px 40px rgba(1, 205, 254, 0.6)
                                `,
							}}
						>
							{char}
						</span>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};