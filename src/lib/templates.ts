export type FontFamily =
	'Montserrat' | 'Space Grotesk' | 'JetBrains Mono' | 'Playfair Display' | 'Archivo Black';

export interface TextStyle {
	font: FontFamily;
	weight: 300 | 400 | 700 | 800 | 900;
	italic?: boolean;
	uppercase?: boolean;
	/** In ems */
	letterSpacing?: number;
}

export interface Template {
	name: string;
	description: string;
	title: TextStyle;
	subtitle: TextStyle & { color: string };
	/** The title's gradient, and the accent's */
	primary: string;
	secondary: string;
	align: 'left' | 'center';
	/** What separates the title and subtitle: a bar beside the subtitle, or a rule between them */
	accent: 'bar' | 'rule' | 'none';
	background: {
		color: string;
		image?: string;
		size?: string;
	};
	/** The RJM pattern, which text stays clear of */
	pattern?: boolean;
	/** Typed in front of the title */
	prompt?: string;
	/** Drawn around the text, inset from the edge of the image */
	frame?: {
		inset: number;
		border: string;
		background?: string;
		shadow?: string;
	};
	/** Window controls in the corner */
	controls?: boolean;
}

const montserrat = {
	title: { font: 'Montserrat', weight: 900 },
	subtitle: { font: 'Montserrat', weight: 300 }
} as const;

export const TEMPLATES = {
	rjm: {
		name: 'RJM',
		description: 'The RJM pattern, on black',
		...montserrat,
		subtitle: { ...montserrat.subtitle, color: '#ffffff' },
		primary: '#701a75',
		secondary: '#a855f7',
		align: 'left',
		accent: 'bar',
		background: { color: '#000000' },
		pattern: true
	},
	black: {
		name: 'Black',
		description: 'White text centred on black',
		...montserrat,
		subtitle: { ...montserrat.subtitle, color: '#a3a3a3' },
		primary: '#ffffff',
		secondary: '#ffffff',
		align: 'center',
		accent: 'none',
		background: { color: '#000000' }
	},
	white: {
		name: 'White',
		description: 'Black text centred on white',
		...montserrat,
		subtitle: { ...montserrat.subtitle, color: '#525252' },
		primary: '#000000',
		secondary: '#000000',
		align: 'center',
		accent: 'none',
		background: { color: '#ffffff' }
	},
	aurora: {
		name: 'Aurora',
		description: 'Cool light over a night sky',
		title: { font: 'Space Grotesk', weight: 700, letterSpacing: -0.02 },
		subtitle: { font: 'Space Grotesk', weight: 400, color: '#c7d2fe' },
		primary: '#22d3ee',
		secondary: '#a78bfa',
		align: 'left',
		accent: 'bar',
		background: {
			color: '#060816',
			image:
				'radial-gradient(circle at 85% 15%, rgba(34,211,238,0.35), rgba(34,211,238,0) 45%), radial-gradient(circle at 60% 100%, rgba(167,139,250,0.4), rgba(167,139,250,0) 50%), radial-gradient(circle at 100% 90%, rgba(52,211,153,0.25), rgba(52,211,153,0) 40%)'
		}
	},
	terminal: {
		name: 'Terminal',
		description: 'A green prompt in a dark window',
		title: { font: 'JetBrains Mono', weight: 800, letterSpacing: -0.02 },
		subtitle: { font: 'JetBrains Mono', weight: 400, color: '#86efac' },
		primary: '#4ade80',
		secondary: '#a3e635',
		align: 'left',
		accent: 'none',
		background: {
			color: '#0a0f0c',
			image: 'radial-gradient(circle at 15% 50%, rgba(74,222,128,0.12), rgba(74,222,128,0) 60%)'
		},
		prompt: '$ ',
		controls: true
	},
	editorial: {
		name: 'Editorial',
		description: 'Serif type on warm paper',
		title: { font: 'Playfair Display', weight: 900 },
		subtitle: { font: 'Playfair Display', weight: 400, italic: true, color: '#57534e' },
		primary: '#1c1917',
		secondary: '#44403c',
		align: 'center',
		accent: 'rule',
		background: { color: '#f5efe3' },
		frame: { inset: 12, border: '2px solid #1c1917' }
	},
	blueprint: {
		name: 'Blueprint',
		description: 'Technical drawing on a blue grid',
		title: { font: 'JetBrains Mono', weight: 800, uppercase: true, letterSpacing: 0.02 },
		subtitle: { font: 'Space Grotesk', weight: 400, color: '#bfdbfe' },
		primary: '#ffffff',
		secondary: '#bfdbfe',
		align: 'left',
		accent: 'bar',
		background: {
			color: '#1e3a8a',
			image:
				'linear-gradient(rgba(255,255,255,0.12) 2px, rgba(255,255,255,0) 2px), linear-gradient(90deg, rgba(255,255,255,0.12) 2px, rgba(255,255,255,0) 2px)',
			size: '48px 48px'
		}
	},
	sunset: {
		name: 'Sunset',
		description: 'Heavy white type on a warm gradient',
		title: { font: 'Archivo Black', weight: 400 },
		subtitle: { font: 'Space Grotesk', weight: 400, color: '#fff7ed' },
		primary: '#ffffff',
		secondary: '#ffedd5',
		align: 'center',
		accent: 'none',
		background: {
			color: '#f97316',
			image: 'linear-gradient(100deg, #f59e0b 0%, #f43f5e 55%, #7c3aed 100%)'
		}
	},
	brutalist: {
		name: 'Brutalist',
		description: 'Hard edges and a loud yellow',
		title: { font: 'Archivo Black', weight: 400, uppercase: true },
		subtitle: { font: 'Space Grotesk', weight: 700, color: '#000000' },
		primary: '#000000',
		secondary: '#000000',
		align: 'left',
		accent: 'none',
		background: { color: '#fde047' },
		frame: {
			inset: 16,
			border: '6px solid #000000',
			background: '#ffffff',
			shadow: '10px 10px 0 #000000'
		}
	}
} as const satisfies Record<string, Template>;

export type TemplateId = keyof typeof TEMPLATES;
