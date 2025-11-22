import {staticFile} from 'remotion';
import React from 'react';

export const GlobalStyles: React.FC = () => {
	return (
		<style>
			{`
        /* 1. Import des polices via staticFile pour garantir le chargement */
        @font-face {
          font-family: 'AlienEncounters';
          src: url('${staticFile('07_FONTS/Alien-Encounters-Bold.ttf')}') format('truetype');
          font-weight: bold;
          font-style: normal;
        }

        @font-face {
          font-family: 'VCR_OSD';
          src: url('${staticFile('07_FONTS/VCR_OSD_MONO_1.001.ttf')}') format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @font-face {
          font-family: 'W95FA';
          src: url('${staticFile('07_FONTS/W95FA.otf')}') format('opentype');
          font-weight: normal;
          font-style: normal;
        }

        /* 2. Variables CSS pour la palette Vaporwave */
        :root {
          --color-neon-pink: #FF71CE;
          --color-neon-cyan: #01CDFE;
          --color-pastel-violet: #B967FF;
          --color-tv-black: #110011;
          --font-title: 'AlienEncounters', sans-serif;
          --font-lyrics: 'VCR_OSD', monospace;
          --font-ui: 'W95FA', sans-serif;
        }

        /* 3. Reset de base */
        body {
          margin: 0;
          background-color: var(--color-tv-black);
          font-family: var(--font-ui);
        }
      `}
		</style>
	);
};