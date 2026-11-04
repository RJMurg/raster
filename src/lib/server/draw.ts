import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import type { TextStyle } from '#lib/templates.js';
import { fonts } from './fonts';
import type { Block } from './layout';

export type Node = { type: string; props: Record<string, unknown> };

export const h = (
	type: string,
	style: object,
	children?: Node | (Node | null)[] | string
): Node => ({
	type,
	props: { style, children }
});

export const textStyle = (style: TextStyle, size: number) => ({
	fontFamily: style.font,
	fontWeight: style.weight,
	fontStyle: style.italic ? 'italic' : 'normal',
	fontSize: size,
	letterSpacing: (style.letterSpacing ?? 0) * size
});

/** Laid out line by line so that what's drawn is exactly what was measured */
export function lines({ size, lineHeight, lines }: Block, center = false) {
	return lines.map((line) =>
		h(
			'div',
			{
				display: 'flex',
				justifyContent: center ? 'center' : 'flex-start',
				height: Math.ceil(size * lineHeight),
				lineHeight: `${Math.ceil(size * lineHeight)}px`,
				whiteSpace: 'pre'
			},
			line
		)
	);
}

/** Draws a tree of elements as a PNG */
export async function draw(tree: Node, width: number, height: number): Promise<Buffer> {
	// satori's types expect React elements; the plain object tree is what it reads either way
	const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
		width,
		height,
		fonts
	});
	return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}

export const pngResponse = (png: Uint8Array<ArrayBuffer>, maxAge: number) =>
	new Response(png, {
		headers: {
			'content-type': 'image/png',
			// GitHub and Forgejo proxy README images and respect this
			'cache-control': `public, max-age=${maxAge}`,
			'access-control-allow-origin': '*'
		}
	});
