import { describe, expect, it } from 'vitest';
import { NOTICE_THEMES, NOTICE_TYPES, parseNotice } from '#lib/notices.js';
import { measurer } from './fonts';
import { WIDTH, buildNotice, renderNotice } from './notice';

const options = (query: string) => parseNotice(new URLSearchParams(query));

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

const texts = (query: string) =>
	collect(buildNotice(options(query)).tree).flatMap(({ props: { children } }) =>
		typeof children === 'string' ? [children] : []
	);

describe('renderNotice', () => {
	describe.each(Object.keys(NOTICE_TYPES))('a %s', (type) => {
		it.each(Object.keys(NOTICE_THEMES))('draws in %s', async (theme) => {
			const query = `type=${type}&theme=${theme}&message=Hello`;
			const png = await renderNotice(options(query));
			expect(size(png)).toEqual({ width: WIDTH, height: buildNotice(options(query)).height });
		});
	});

	it('copes with a title and nothing else', async () => {
		expect(size(await renderNotice(options('type=tip'))).width).toBe(WIDTH);
	});
});

describe('buildNotice', () => {
	it('grows with its message rather than cutting it off', () => {
		const long = encodeURIComponent('A message that goes on for a while. '.repeat(13));
		const short = buildNotice(options('message=Short')).height;

		expect(buildNotice(options(`message=${long}`)).height).toBeGreaterThan(short);
		expect(texts(`message=${long}`).join(' ')).not.toContain('…');
		expect(texts(`message=${long}`).at(-1)).toMatch(/while\.?$/);
	});

	it('is shorter without a message', () => {
		expect(buildNotice(options('')).height).toBeLessThan(buildNotice(options('message=Hi')).height);
	});

	it('wraps long titles beside the icon', () => {
		const title = encodeURIComponent('A title that carries on '.repeat(5).trim());
		expect(texts(`title=${title}`).length).toBeGreaterThan(1);
	});

	it('keeps forced line breaks', () => {
		expect(texts('message=One%0ATwo')).toEqual(['Note', 'One', 'Two']);
	});

	it('keeps every line inside the image', () => {
		const measure = measurer({ font: 'Montserrat', weight: 300 });
		const lines = texts(`message=${'x'.repeat(500)}`).slice(1);

		expect(lines.length).toBeGreaterThan(1);
		for (const line of lines) expect(measure(line, 34)).toBeLessThan(WIDTH);
	});

	it('uses colours that suit the theme', () => {
		const color = (query: string) =>
			collect(buildNotice(options(query)).tree)[1].props.style!.backgroundColor;
		expect(color('type=warning')).not.toBe(color('type=warning&theme=light'));
		expect(color('type=warning')).not.toBe(color('type=caution'));
	});
});
