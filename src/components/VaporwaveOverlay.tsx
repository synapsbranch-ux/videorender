import React from 'react';
import {AbsoluteFill, Video, staticFile, useCurrentFrame, interpolate, random} from 'remotion';

export const VaporwaveOverlay: React.FC = () => {
    const frame = useCurrentFrame();

    // --- MAGIE 1 : LE RGB SPLIT (Déchirement des couleurs) ---
    // On génère une valeur aléatoire qui change toutes les 5 frames
    const seed = Math.floor(frame / 5); 
    const chaos = random(seed); // Retourne un nombre entre 0 et 1
    
    // Si le chaos est > 0.8 (20% du temps), on active un GLITCH
    const isGlitching = chaos > 0.85;
    
    // Calcul du décalage RGB (Abberation)
    // En temps normal : 2px (subtil). En Glitch : 15px (violent).
    const rgbShift = isGlitching ? interpolate(random(frame), [0, 1], [5, 15]) : 2;
    
    // --- MAGIE 2 : LE VHS TRACKING (Saut d'image vertical) ---
    // Une barre qui descend lentement toutes les 200 frames
    const trackingPos = (frame % 200) / 200; // 0 -> 1
    const trackingBarY = interpolate(trackingPos, [0, 1], [-10, 110]); // De haut en bas en %

    return (
        <AbsoluteFill style={{pointerEvents: 'none'}}>
            
            {/* 1. COUCHE RGB (Simulation par CSS text-shadow ou box-shadow n'est pas possible sur video) 
               ASTUCE PRO : On utilise 'backdrop-filter' ou des mix-blend-mode complexes, 
               mais pour Remotion simple, on simule l'effet global par dessus. 
            */}
            
            {/* 2. SCANLINES (Lignes TV) - Plus fines et plus rapides */}
            <Video
                src={staticFile('04_OVERLAYS/scanlines_1080p_overlay.mp4')}
                style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    opacity: 0.25, mixBlendMode: 'overlay',
                }}
                loop muted
            />

            {/* 3. EFFET GLITCH VHS (Bruit statique) - Réactif */}
            <Video
                src={staticFile('04_OVERLAYS/vhs_static_noise_black.mp4')}
                style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    // Le bruit devient plus fort quand ça glitch
                    opacity: isGlitching ? 0.4 : 0.12, 
                    mixBlendMode: 'screen',
                    // On inverse le bruit parfois pour varier
                    transform: chaos > 0.5 ? 'scaleX(-1)' : 'none'
                }}
                loop muted
            />

            {/* 4. BANDE DE TRACKING (La barre de distorsion qui descend) */}
            <div style={{
                position: 'absolute',
                top: `${trackingBarY}%`,
                left: 0, right: 0,
                height: '15%', // Une bande de 15% de hauteur
                background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.1), transparent)',
                backdropFilter: 'blur(3px) hue-rotate(90deg)', // Tord l'image derrière
                opacity: 0.5,
                boxShadow: '0 0 20px rgba(255,255,255,0.2)'
            }} />

            {/* 5. COLOR GRADING & VIBE "DREAMY" */}
            <AbsoluteFill
                style={{
                    background: 'linear-gradient(45deg, rgba(255,113,206,0.15) 0%, rgba(1,205,254,0.15) 100%)',
                    mixBlendMode: 'soft-light',
                }}
            />
            
            {/* 6. VIGNETTE TV + EFFET RGB SPLIT GLOBAL (Simulé via SVG Filter) */}
            <AbsoluteFill style={{
                background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(10,0,10,0.9) 100%)',
                // C'est ici la touche secrète : le filtre SVG définit plus bas
                filter: `url(#rgb-split)`, 
            }}>
                {/* On injecte le filtre SVG directement dans le DOM */}
                <svg width="0" height="0">
                    <filter id="rgb-split">
                        {/* Décalage du canal ROUGE */}
                        <feOffset in="SourceGraphic" dx={rgbShift} dy="0" result="red-offset" />
                        {/* Décalage du canal BLEU */}
                        <feOffset in="SourceGraphic" dx={-rgbShift} dy="0" result="blue-offset" />
                        
                        {/* On recompose les canaux (c'est technique mais ça marche) */}
                        <feMerge>
                            <feMergeNode in="red-offset" />
                            <feMergeNode in="SourceGraphic" /> 
                            <feMergeNode in="blue-offset" />
                        </feMerge>
                        
                        {/* On ajoute un peu de bruit chromatique */}
                        <feColorMatrix type="matrix" values="
                            1 0 0 0 0 
                            0 0.9 0 0 0 
                            0 0 1 0 0 
                            0 0 0 1 0" 
                        />
                    </filter>
                </svg>
            </AbsoluteFill>
        </AbsoluteFill>
    );
};