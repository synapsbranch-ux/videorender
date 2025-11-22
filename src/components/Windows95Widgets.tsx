import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, interpolate} from 'remotion';

const WIDGETS = [
    // 1. Statue Grecque -> Coin Haut Gauche (Réduite)
	{img: 'greek_statue_helios.png', x: 50, y: 50, start: 100, end: 600, scale: 0.5, blend: 'luminosity'},
	
    // 2. Kanji Amour -> Haut Droite
    {img: 'kanji_amour_ai.png', x: 1700, y: 80, start: 450, end: 900, scale: 0.6, blend: 'screen'},
	
    // 3. Erreur Windows -> Haut Centre-Gauche (Décalé pour ne pas être au milieu)
    {img: 'win95_error_popup.png', x: 400, y: 60, start: 900, end: 1300, scale: 0.5, blend: 'normal'},
	
    // 4. Palmier -> Haut Centre-Droite
    {img: 'palm_tree_silhouette.png', x: 1400, y: 40, start: 1300, end: 1800, scale: 0.6, blend: 'overlay'},
    
    // 5. Curseur Sablier -> Il se balade tout en haut à droite
    {img: 'win95_hourglass_cursor.png', x: 1800, y: 40, start: 0, end: 3400, scale: 1.5, blend: 'exclusion'}, 
    
    // 6. Bouton Start -> On le laisse discret en bas à gauche (seul élément en bas, tout petit)
    {img: 'win95_start_button.png', x: 20, y: 980, start: 50, end: 3400, scale: 0.8, blend: 'normal'},
];

export const Windows95Widgets: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}> 
			{WIDGETS.map((widget, i) => {
                // Vérification temporelle
                if (frame < widget.start || frame > widget.end) return null;

                // 1. Fade In / Fade Out fluide
                const duration = widget.end - widget.start;
                const relativeFrame = frame - widget.start;
                const opacity = interpolate(relativeFrame, [0, 20, duration - 20, duration], [0, 1, 1, 0]);

                // 2. Flottement très léger (moins ample qu'avant pour rester en haut)
                const floatY = Math.sin(frame / 60) * 10; 

				return (
					<Img
						key={i}
						src={staticFile(`05_IMAGES_PNG/${widget.img}`)}
						style={{
							position: 'absolute',
							left: widget.x,
							top: widget.y + floatY, // Reste en haut + petit mouvement
							transform: `scale(${widget.scale})`,
                            opacity: opacity * 0.9, 
                            // @ts-ignore
                            mixBlendMode: widget.blend,
						}}
					/>
				);
			})}
		</AbsoluteFill>
	);
};