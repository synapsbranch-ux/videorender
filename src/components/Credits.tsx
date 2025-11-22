import React from 'react';
import {AbsoluteFill, useCurrentFrame, Img, staticFile} from 'remotion';

export const Credits: React.FC = () => {
	const frame = useCurrentFrame();
    const op = Math.min(1, frame / 20);

	return (
		<AbsoluteFill style={{backgroundColor: '#000080', alignItems: 'center', justifyContent: 'center', opacity: op}}>
            <div style={{textAlign: 'center', color: 'white', fontFamily: 'VCR_OSD, monospace', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                
                <h1 style={{fontSize: 60, textShadow: '4px 4px #000', marginBottom: 20}}>FIN DU PROGRAMME</h1>
                
                {/* LOGO ISTEAH */}
                <Img 
                    src={staticFile('05_IMAGES_PNG/isteah.jpeg')} 
                    style={{width: 150, height: 'auto', borderRadius: 10, border: '2px solid white', marginBottom: 30}}
                />

                <div style={{fontSize: 35, lineHeight: 1.4}}>
                    <p>RÉALISATION & EDIT</p>
                    <p style={{color: '#FF71CE', fontWeight: 'bold'}}>JOSEPH SAMUEL JONATHAN</p>
                </div>

                <div style={{fontSize: 25, marginTop: 30, opacity: 0.9}}>
                    <p>MUSIQUE : LUTHER - MERCI (ODDMAN)</p>
                </div>

                <div style={{fontSize: 18, marginTop: 40, borderTop: '1px solid white', paddingTop: 20, maxWidth: 800}}>
                    <p>PROJET ÉDUCATIF - INF4300 MULTIMÉDIA</p>
                    <p>INSTITUT DES SCIENCES, DES TECHNOLOGIES ET DES ÉTUDES AVANCÉES D'HAÏTI (ISTEAH)</p>
                </div>
            </div>
            
            {/* Scanlines */}
            <div style={{
                position: 'absolute', inset: 0, 
                background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                backgroundSize: '100% 4px',
                pointerEvents: 'none'
            }} />
		</AbsoluteFill>
	);
};