import { describe, expect, it } from 'vitest';
import { FORMATS, parseOptions, type Format } from '#lib/options.js';
import { TEMPLATES } from '#lib/templates.js';
import { buildTree, renderHeader } from './render';

const PNG_SIGNATURE = '89504e470d0a1a0a';
const LOREM = 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod '.repeat(8);

const options = (query: string) => parseOptions(new URLSearchParams(query));

const size = (png: Buffer) => ({ width: png.readUInt32BE(16), height: png.readUInt32BE(20) });

type Tree = { type: string; props: { style?: Record<string, unknown>; children?: unknown } };

function collect(node: unknown, found: Tree[] = []) {
	if (Array.isArray(node)) node.forEach((child) => collect(child, found));
	else if (node && typeof node === 'object') {
		found.push(node as Tree);
		collect((node as Tree).props.children, found);
	}
	return found;
}

const nodes = (query: string) => collect(buildTree(options(query), []));
const texts = (query: string) =>
	nodes(query).flatMap(({ props }) => (typeof props.children === 'string' ? [props.children] : []));
const images = (query: string) => nodes(query).filter(({ type }) => type === 'img');

/** The element holding all of the text */
const box = (query: string) =>
	nodes(query).find(
		({ props: { style } }) => style?.position === 'absolute' && style.flexDirection === 'column'
	)!.props.style!;

describe('renderHeader', () => {
	it.each(Object.keys(FORMATS) as Format[])('draws a PNG the size of %s', async (format) => {
		const png = await renderHeader(options(`title=Hi&subtitle=There&format=${format}`));

		expect(png.toString('hex', 0, 8)).toBe(PNG_SIGNATURE);
		expect(size(png)).toEqual({ width: FORMATS[format].width, height: FORMATS[format].height });
	});

	it('draws square images square', () => {
		expect(FORMATS.square.width).toBe(FORMATS.square.height);
	});

	describe.each(Object.keys(TEMPLATES))('the %s template', (template) => {
		it.each(Object.keys(FORMATS))('draws at %s', async (format) => {
			const query = new URLSearchParams({ title: 'Raster', subtitle: LOREM, template, format });
			expect(size(await renderHeader(options(query.toString()))).width).toBe(
				FORMATS[format as Format].width
			);
		});
	});

	it('copes with accents, and letters the fonts lack', async () => {
		const png = await renderHeader(options('title=Ruán Č&subtitle=日本語&template=sunset'));
		expect(png.toString('hex', 0, 8)).toBe(PNG_SIGNATURE);
	});

	it('draws badges', async () => {
		const pixel =
			'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
		const png = await renderHeader(options('title=Hi'), [{ src: pixel, width: 80, height: 28 }]);
		expect(size(png).width).toBe(2072);
	});
});

describe('buildTree', () => {
	it('keeps text out of the pattern', () => {
		const { left, width } = box('subtitle=Hi') as { left: number; width: number };
		expect(left + width).toBeLessThanOrEqual(900);

		const square = box('subtitle=Hi&format=square') as { top: number; height: number };
		expect(square.top + square.height).toBeLessThanOrEqual(760);
	});

	it('uses the full width once the pattern is gone', () => {
		const { left, width } = box('subtitle=Hi&logo=false') as { left: number; width: number };
		expect(left + width).toBe(2072 - left);
	});

	it('draws the pattern unless asked not to', () => {
		expect(images('title=Hi')).toHaveLength(1);
		expect(images('title=Hi&logo=false')).toHaveLength(0);
	});

	it("doesn't put the pattern on other templates", () => {
		expect(images('title=Hi&template=black')).toHaveLength(0);
		expect(images('title=Hi&template=white')).toHaveLength(0);
	});

	it('takes alignment from the template', () => {
		expect(box('template=rjm').alignItems).toBe('flex-start');
		expect(box('template=black').alignItems).toBe('center');
	});

	it('lets alignment be overridden', () => {
		expect(box('template=rjm&align=center').alignItems).toBe('center');
		expect(box('template=black&align=left').alignItems).toBe('flex-start');
	});

	it('keeps titles on one line in banners unless told otherwise', () => {
		const title = encodeURIComponent('A title that is really quite long and goes on and on');
		expect(texts(`title=${title}`)).toHaveLength(1);
		expect(texts(`title=${title}&wrap=true`).length).toBeGreaterThan(1);
	});

	it('wraps titles in the taller formats unless told otherwise', () => {
		const title = encodeURIComponent('A title that is really quite long and goes on and on');
		expect(texts(`title=${title}&format=square`).length).toBeGreaterThan(1);
		expect(texts(`title=${title}&format=square&wrap=false`)).toHaveLength(1);
	});

	it('keeps the subtitle when a wrapped title takes up the space', () => {
		const title = encodeURIComponent('A title long enough that it really does need wrapping');
		expect(texts(`title=${title}&subtitle=Short&wrap=true`)).toContain('Short');
	});

	it('changes the size of the title', () => {
		const fontSize = (query: string) =>
			nodes(query).find(({ props: { style } }) => style?.backgroundClip === 'text')!.props.style!
				.fontSize;

		expect(fontSize('title=Hi&titleSize=s')).toBe(65);
		expect(fontSize('title=Hi&titleSize=l')).toBe(100);
		expect(fontSize('title=Hi&titleSize=xl')).toBe(125);
		expect(fontSize('title=Hi&titleSize=64')).toBe(64);
	});

	it('types a prompt in front of terminal titles', () => {
		expect(texts('title=Hi&template=terminal')).toContain('$ Hi');
	});

	it('uppercases where the template does', () => {
		expect(texts('title=Hi&template=brutalist')).toContain('HI');
		expect(texts('title=Hi&template=black')).toContain('Hi');
	});

	it('only draws an accent for a subtitle', () => {
		const accents = (query: string) =>
			nodes(query).filter(({ props: { style } }) =>
				String(style?.backgroundImage).includes('to top')
			);
		expect(accents('title=Hi&subtitle=There')).toHaveLength(1);
		expect(accents('title=Hi')).toHaveLength(0);
	});

	it('centres the subtitle on the bar', () => {
		const row = nodes('title=Hi&subtitle=There').find(
			({ props: { style } }) => style?.alignItems === 'center' && style.flexDirection !== 'column'
		);
		expect(row).toBeDefined();
	});

	it('applies custom colours', () => {
		const title = nodes('title=Hi&primary=112233&secondary=445566').find(
			({ props: { style } }) => style?.backgroundClip === 'text'
		)!;
		expect(title.props.style!.backgroundImage).toContain('#112233');
		expect(title.props.style!.backgroundImage).toContain('#445566');
	});

	it('makes room for badges', () => {
		const lorem = encodeURIComponent(LOREM);
		const tree = (badges: { src: string; width: number; height: number }[]) =>
			collect(buildTree(options(`title=Hi&subtitle=${lorem}`), badges)).filter(
				({ props }) => typeof props.children === 'string'
			).length;
		const badge = { src: 'data:image/png;base64,AA', width: 80, height: 28 };
		expect(tree([badge])).toBeLessThanOrEqual(tree([]));
	});

	it('shrinks badges that would be too wide', () => {
		const badges = Array.from({ length: 6 }, () => ({
			src: 'data:image/png;base64,AA',
			width: 400,
			height: 28
		}));
		const drawn = collect(buildTree(options('title=Hi'), badges)).filter(
			({ type, props }) => type === 'img' && (props as { height: number }).height <= 28
		);
		const total = drawn.reduce((sum, { props }) => sum + (props as { width: number }).width, 0);
		expect(drawn).toHaveLength(6);
		expect(total).toBeLessThanOrEqual(830);
	});
});
