import { Resvg } from '@resvg/resvg-js';
import { FORMATS, type Format } from '#lib/options.js';
import { outline } from './fonts';

const FONT_SIZE = 64;
// Measured off the original artwork
const ANGLE = 14;
const COLUMN = 160;
const ROW = 64;
// Montserrat's letters are made of overlapping shapes, so they're filled with the background to
// cover the strokes inside them. That hides the inner half of the outline too, hence doubling it.
const STROKE = 2.4;

const WORD = 'RJM';
const WORD_STYLE = { font: 'Montserrat', weight: 900 } as const;

/** Where each format's pattern fades in, and the row that's filled in to stand out */
const LAYOUT: Record<Format, { from: [number, number]; to: [number, number]; solidRow: number }> = {
	banner: { from: [900, 0], to: [2072, 0], solidRow: -3 },
	og: { from: [830, 315], to: [1200, 420], solidRow: 2 },
	square: { from: [1200, 760], to: [1260, 1040], solidRow: 11 }
};

/** The repeating RJM artwork, as an SVG the size of the format */
function pattern(format: Format) {
	const { width, height } = FORMATS[format];
	const { from, to, solidRow } = LAYOUT[format];

	const path = outline(WORD_STYLE, WORD, FONT_SIZE);
	// The rows are rotated around the image's corner, so go far enough out to cover it at any size
	const reach = Math.ceil(Math.hypot(width, height));
	const words: string[] = [];

	for (let row = -Math.ceil(reach / ROW); row <= Math.ceil(reach / ROW); row++) {
		for (let column = -1; column <= Math.ceil(reach / COLUMN); column++) {
			const x = column * COLUMN + (row * ROW) / 4;
			const y = row * ROW;
			if (!visible(x, y, width, height)) continue;
			words.push(`<use href="#${row === solidRow ? 'solid' : 'line'}" x="${x}" y="${y}"/>`);
		}
	}

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><defs><path id="solid" d="${path}" fill="#fff" fill-opacity="0.55"/><path id="line" d="${path}" fill="#000" stroke="#fff" stroke-width="${STROKE}" paint-order="stroke"/><linearGradient id="fade" gradientUnits="userSpaceOnUse" x1="${from[0]}" y1="${from[1]}" x2="${to[0]}" y2="${to[1]}"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="url(#fade)"/></mask></defs><rect width="${width}" height="${height}" fill="#000"/><g mask="url(#mask)"><g transform="rotate(${ANGLE})">${words.join('')}</g></g></svg>`;
}

/** Whether a word at this spot on the rotated grid lands anywhere on the image */
function visible(x: number, y: number, width: number, height: number) {
	const radians = (ANGLE * Math.PI) / 180;
	const screenX = x * Math.cos(radians) - y * Math.sin(radians);
	const screenY = x * Math.sin(radians) + y * Math.cos(radians);
	return (
		screenX > -COLUMN * 2 &&
		screenX < width + COLUMN &&
		screenY > -COLUMN &&
		screenY < height + COLUMN
	);
}

const rendered = new Map<Format, string>();

/** The pattern as a PNG data URL. Each format's is only drawn once. */
export function patternImage(format: Format) {
	let image = rendered.get(format);
	if (!image) {
		const png = new Resvg(pattern(format)).render().asPng();
		image = `data:image/png;base64,${png.toString('base64')}`;
		rendered.set(format, image);
	}
	return image;
}
