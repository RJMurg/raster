import { createRequire } from 'node:module';
import { parse, type Font as Parsed } from '@shuding/opentype.js';
import archivoBlack from '@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff?inline';
import jetbrainsBold from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-800-normal.woff?inline';
import jetbrainsRegular from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff?inline';
import playfairBlack from '@fontsource/playfair-display/files/playfair-display-latin-900-normal.woff?inline';
import playfairItalic from '@fontsource/playfair-display/files/playfair-display-latin-400-italic.woff?inline';
import spaceBold from '@fontsource/space-grotesk/files/space-grotesk-latin-700-normal.woff?inline';
import spaceRegular from '@fontsource/space-grotesk/files/space-grotesk-latin-400-normal.woff?inline';
import montserratBlack from '#lib/assets/fonts/Montserrat-Black.ttf?inline';
import montserratLight from '#lib/assets/fonts/Montserrat-Light.ttf?inline';
import type { TextStyle } from '#lib/templates.js';

// Inlined into the server bundle as data URLs, so nothing is read from disk at runtime
const bytes = (dataUrl: string) => Buffer.from(dataUrl.slice(dataUrl.indexOf(',') + 1), 'base64');

type Weight = 400 | 700 | 800 | 900;

const face = (name: TextStyle['font'], data: string, weight: number, style = 'normal') => ({
	name,
	data: bytes(data),
	weight: weight as Weight,
	style: style as 'normal' | 'italic'
});

// Montserrat comes first as it's the only one beyond the basic latin range, which makes it what
// satori falls back to for accented letters the others don't have
export const fonts = [
	face('Montserrat', montserratBlack, 900),
	face('Montserrat', montserratLight, 300),
	face('Space Grotesk', spaceBold, 700),
	face('Space Grotesk', spaceRegular, 400),
	face('JetBrains Mono', jetbrainsBold, 800),
	face('JetBrains Mono', jetbrainsRegular, 400),
	face('Playfair Display', playfairBlack, 900),
	face('Playfair Display', playfairItalic, 400, 'italic'),
	face('Archivo Black', archivoBlack, 400)
];

const { resolve } = createRequire(import.meta.url);

/** Fonts for rendering SVGs, which shields.io and GitHub ask for by name. resvg only takes paths. */
export const badgeFonts = [
	resolve('dejavu-fonts-ttf/ttf/DejaVuSans.ttf'),
	resolve('dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf')
];
export const BADGE_FONT = 'DejaVu Sans';

const parsed = new Map<string, Parsed>();

/** The font to measure a text style with */
function find({ font, weight, italic }: Pick<TextStyle, 'font' | 'weight' | 'italic'>) {
	const key = `${font}:${weight}:${italic ?? false}`;
	const cached = parsed.get(key);
	if (cached) return cached;

	const style = italic ? 'italic' : 'normal';
	const match = fonts.find((f) => f.name === font && f.weight === weight && f.style === style);
	if (!match) throw new Error(`No font for ${key}`);

	const result = parse(new Uint8Array(match.data).buffer);
	parsed.set(key, result);
	return result;
}

/** A function to measure text in a style, including its letter spacing */
export function measurer(style: TextStyle) {
	const font = find(style);
	const spacing = style.letterSpacing ?? 0;
	return (text: string, size: number) =>
		font.getAdvanceWidth(text, size) + [...text].length * spacing * size;
}

/** Outlines of some text, as SVG path data */
export const outline = (style: Pick<TextStyle, 'font' | 'weight'>, text: string, size: number) =>
	find(style).getPath(text, 0, 0, size).toPathData(2);
