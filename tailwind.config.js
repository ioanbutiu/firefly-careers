/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{ts,tsx}'],
	theme: {
		extend: {
			colors: {
				accent: '#e9ff7d',
				ink: '#04101a',
				'ink-medium': '#4d555e',
				'ink-subtle': '#909ba0',
				hairline: '#d1d4d6',
				surface: '#ffffff',
				'surface-subtle': '#f2f6fb',
				'surface-grey': '#eef0f1',
			},
			fontFamily: {
				sans: ['"Schrifted Sans"', 'system-ui', 'sans-serif'],
				body: ['"Schrifted Sans Comp"', 'system-ui', 'sans-serif'],
				mono: ['"GT America Mono"', 'ui-monospace', 'monospace'],
			},
			borderRadius: {
				sm: '4px',
				md: '8px',
			},
			maxWidth: {
				page: '1240px',
			},
		},
	},
	plugins: [],
};
