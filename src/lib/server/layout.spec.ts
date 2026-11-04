import { describe, expect, it } from 'vitest';
import { balance, clamp, fit, wrap, type FitOptions, type Measure } from './layout';

// Every character is half as wide as it is tall, which keeps the sums here easy to follow
const measure: Measure = (text, size) => text.length * size * 0.5;
const SAFETY = 1.02;

const options = (overrides: Partial<FitOptions> = {}): FitOptions => ({
	title: 'Title',
	subtitle: 'Subtitle',
	titleStyle: { size: 100, minSize: 40, lineHeight: 1.15, measure },
	subtitleStyle: { size: 40, minSize: 20, lineHeight: 1.3, measure },
	width: 800,
	height: 220,
	subtitleIndent: 0,
	wrapTitle: false,
	gap: 8,
	reserved: 0,
	balanced: false,
	...overrides
});

const widest = (lines: string[], size: number) =>
	Math.max(...lines.map((line) => measure(line, size)));

describe('wrap', () => {
	it('fills each line before moving on to the next', () => {
		expect(wrap('aa bb cc dd', 30, 10, measure)).toEqual(['aa bb', 'cc dd']);
	});

	it('keeps forced line breaks', () => {
		expect(wrap('aa\nbb', 500, 10, measure)).toEqual(['aa', 'bb']);
	});

	it('ignores repeated whitespace', () => {
		expect(wrap('  aa   bb  ', 500, 10, measure)).toEqual(['aa bb']);
	});

	it('gives nothing for no text', () => {
		expect(wrap('', 500, 10, measure)).toEqual([]);
	});
});

describe('balance', () => {
	it("doesn't leave a word stranded on the last line", () => {
		const text = 'aaaa bbbb cccc dddd eeee';
		expect(wrap(text, 100, 10, measure).at(-1)).toBe('eeee');

		const lines = balance(text, 100, 10, measure);
		expect(lines).toHaveLength(2);
		expect(lines.at(-1)).not.toBe('eeee');
	});

	it('leaves a single line alone', () => {
		expect(balance('aa bb', 500, 10, measure)).toEqual(['aa bb']);
	});
});

describe('clamp', () => {
	it('leaves text that fits alone', () => {
		expect(clamp(['a', 'b'], 2, 100, 10, measure)).toEqual(['a', 'b']);
	});

	it('ends on an ellipsis when lines are lost', () => {
		expect(clamp(['aa bb', 'cc dd', 'ee'], 2, 100, 10, measure)).toEqual(['aa bb', 'cc dd…']);
	});

	it('makes room for the ellipsis', () => {
		const [line] = clamp(['aaaa bbbb', 'cc'], 1, 45, 10, measure);
		expect(line).toBe('aaaa…');
		expect(measure(line, 10)).toBeLessThanOrEqual(45);
	});

	it("doesn't leave punctuation before the ellipsis", () => {
		expect(clamp(['aa, bb,', 'cc'], 1, 500, 10, measure)).toEqual(['aa, bb…']);
	});
});

describe('fit', () => {
	it('keeps the sizes asked for when everything fits', () => {
		const { title, subtitle } = fit(options());
		expect(title.size).toBe(100);
		expect(subtitle.size).toBe(40);
	});

	it('shrinks a title to fit on one line', () => {
		const { title } = fit(options({ title: 'A'.repeat(30) }));
		expect(title.lines).toHaveLength(1);
		expect(title.size).toBeLessThan(100);
		expect(measure(title.lines[0], title.size) * SAFETY).toBeLessThanOrEqual(800);
	});

	it('wraps a title when allowed to', () => {
		const { title } = fit(options({ title: 'Word '.repeat(10).trim(), wrapTitle: true }));
		expect(title.lines.length).toBeGreaterThan(1);
	});

	it('joins a title onto one line when not wrapping', () => {
		expect(fit(options({ title: 'aa\nbb' })).title.lines).toEqual(['aa bb']);
	});

	it('allows for the indent beside the subtitle', () => {
		const { subtitle } = fit(options({ subtitle: 'word '.repeat(40), subtitleIndent: 100 }));
		expect(widest(subtitle.lines, subtitle.size) * SAFETY).toBeLessThanOrEqual(700);
	});

	it('leaves out nothing when there is no subtitle', () => {
		const { subtitle, height } = fit(options({ subtitle: '' }));
		expect(subtitle.lines).toEqual([]);
		expect(height).toBe(115);
	});

	it('counts reserved space', () => {
		const { height, title } = fit(options({ reserved: 100 }));
		expect(height).toBeLessThanOrEqual(220);
		expect(title.size).toBeLessThan(100);
	});

	it('cuts text off once it cannot get any smaller', () => {
		const { title, subtitle } = fit(options({ subtitle: 'word '.repeat(500) }));
		expect(subtitle.size).toBe(20);
		expect(subtitle.lines.at(-1)).toMatch(/…$/);
		expect(title.lines).toHaveLength(1);
	});

	it('always leaves a line for the subtitle, however long the title', () => {
		const { subtitle } = fit(
			options({
				title: 'Word '.repeat(100).trim(),
				wrapTitle: true,
				subtitle: 'Short subtitle',
				subtitleHeight: (height) => Math.max(80, height)
			})
		);
		expect(subtitle.lines).toEqual(['Short subtitle']);
	});

	it('breaks up words too long for a line', () => {
		const { subtitle } = fit(options({ subtitle: 'x'.repeat(400) }));
		expect(widest(subtitle.lines, subtitle.size) * SAFETY).toBeLessThanOrEqual(800);
	});

	it.each([
		['short', 'text'],
		['A very long title '.repeat(10), 'A very long subtitle '.repeat(30)],
		['x'.repeat(120), 'y'.repeat(500)],
		['a\nb\nc\nd\ne\nf\ng\nh', '1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12']
	])('never overflows, with %#', (title, subtitle) => {
		for (const wrapTitle of [true, false]) {
			for (const reserved of [0, 44]) {
				const result = fit(options({ title, subtitle, wrapTitle, reserved }));
				expect(result.height).toBeLessThanOrEqual(220);
				expect(widest(result.title.lines, result.title.size) * SAFETY).toBeLessThanOrEqual(800);
				expect(widest(result.subtitle.lines, result.subtitle.size) * SAFETY).toBeLessThanOrEqual(
					800
				);
			}
		}
	});
});
