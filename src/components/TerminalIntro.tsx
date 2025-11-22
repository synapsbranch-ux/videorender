import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, Sequence} from 'remotion';

// Configuration des lignes de commande
const LINES = [
    {text: '> SYSTEM BOOT: ISTEAH_OS_V1.0', start: 20},
    {text: '> USER_AUTH: JOSEPH_SAMUEL_JONATHAN', start: 80},
    {text: '> PASSWORD: ******************', start: 140},
    {text: '> ACCESS GRANTED.', start: 190, color: '#01CDFE'}, // Cible : Frame 190
    {text: '', start: 220},
    {text: 'C:\\ISTEAH\\INF4300> dir /w', start: 230},
    {text: '  COURSE_NOTES.TXT   PROJECT_FINAL.PRJ', start: 260, speed: 1},
    {text: '  MERCI.EXE', start: 280, color: '#FF71CE', speed: 1},
    {text: '', start: 300},
    {text: 'C:\\ISTEAH\\INF4300> start merci.exe', start: 310},
];

export const TerminalIntro: React.FC = () => {
    const frame = useCurrentFrame();

    // Effet de scintillement de l'écran (Flicker)
    const flicker = Math.sin(frame * 0.5) * 0.02 + 0.98;

    // On cherche la frame exacte où "ACCESS GRANTED" commence pour caler le son
    const successLine = LINES.find(l => l.text.includes('ACCESS GRANTED'));
    const successStartFrame = successLine ? successLine.start : 190;

    return (
        <AbsoluteFill style={{backgroundColor: '#050505', overflow: 'hidden'}}>
            
            {/* --- 1. BRUITAGE CLAVIER (Typing) --- */}
            <Audio 
                src={staticFile('06_SFX/keyboard_typing.wav')} 
                loop 
                volume={(f) => {
                    const isTyping = LINES.some(line => {
                        if (line.text.length === 0) return false;
                        const speed = line.speed || 2;
                        const duration = line.text.length * speed;
                        return f >= line.start && f < (line.start + duration);
                    });
                    return isTyping ? 0.5 : 0;
                }}
            />

            {/* --- 2. GESTION DES SFX SPÉCIAUX (Success) --- */}
            {/* On utilise Sequence pour dire "Commence à jouer ce son à la frame X" */}
            <Sequence from={successStartFrame}>
                <Audio 
                    src={staticFile('success.mp3')} // Assurez-vous que le fichier est dans public/
                    volume={0.8} 
                />
            </Sequence>


            {/* --- 3. VISUEL --- */}
            <div style={{
                width: '100%', height: '100%',
                padding: 80,
                fontFamily: 'VCR_OSD, monospace',
                fontSize: 35,
                lineHeight: 1.5,
                color: '#33FF00',
                textShadow: '0 0 5px #33FF00, 2px 2px 2px rgba(0,255,0,0.4)',
                opacity: flicker,
                transform: 'scale(0.95)', 
                filter: 'contrast(1.2) brightness(1.1)',
            }}>
                
                {LINES.map((line, i) => (
                    <TypewriterLine 
                        key={i} 
                        text={line.text} 
                        startFrame={line.start} 
                        color={line.color}
                        speed={line.speed} 
                    />
                ))}

                {/* Curseur clignotant à la fin */}
                {frame > 360 && (
                    <div style={{marginTop: 10, color: '#33FF00'}}>
                         EXECUTING... <span style={{opacity: Math.floor(frame / 10) % 2}}>█</span>
                    </div>
                )}
            </div>

            {/* OVERLAY CRT */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `
                    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
                    linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06))
                `,
                backgroundSize: '100% 3px, 3px 100%',
                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.9)',
                pointerEvents: 'none',
                borderRadius: '20px'
            }} />
            
        </AbsoluteFill>
    );
};

// Composant TypewriterLine (Inchangé)
const TypewriterLine: React.FC<{text: string, startFrame: number, color?: string, speed?: number}> = ({text, startFrame, color, speed = 2}) => {
    const frame = useCurrentFrame();
    if (frame < startFrame) return null;
    const charsToShow = Math.floor((frame - startFrame) / speed);
    const currentText = text.substring(0, charsToShow);
    return <div style={{color: color || '#33FF00'}}>{currentText}</div>;
};