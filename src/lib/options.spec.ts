import { describe, expect, it } from 'vitest';
import {
	MAX_BADGES,
	MAX_SUBTITLE_LENGTH,
	MAX_TITLE_LENGTH,
	parseOptions,
	toQuery
} from './options';

const parse = (query: string) => parseOptions(new URLSearchParams(query));

describe('parseOptions', () => {
	it('has defaults for everything', () => {
		expect(parse('')).toEqual({
			title: 'TITLE',
			subtitle: '',
			template: 'rjm',
			format: 'banner',
			align: undefined,
			titleSize: 'l',
			wrap: undefined,
			logo: true,
			primary: undefined,
			secondary: undefined,
			badges: []
		});
	});

	it('still reads URLs from before the options were added', () => {
		const options = parse('title=SK&subtitle=My%20Template&primary=%23ff0000&secondary=%2300ff00');
		expect(options).toMatchObject({
			title: 'SK',
			subtitle: 'My Template',
			primary: '#ff0000',
			secondary: '#00ff00'
		});
	});

	it.each(['nope', 'toString', '__proto__', 'constructor'])('ignores a template of %s', (value) => {
		expect(parse(`template=${value}`).template).toBe('rjm');
		expect(parse(`format=${value}`).format).toBe('banner');
	});

	it('accepts hex colours with or without the #', () => {
		expect(parse('primary=abc').primary).toBe('#abc');
		expect(parse('primary=%23aabbcc').primary).toBe('#aabbcc');
		expect(parse('primary=%23aabbcc80').primary).toBe('#aabbcc80');
	});

	it.each(['red', 'url(evil)', '#12', 'rgb(0,0,0)', '#gggggg', ''])(
		'ignores a colour of %s',
		(value) => {
			expect(parse(`primary=${encodeURIComponent(value)}`).primary).toBeUndefined();
		}
	);

	it('reads title sizes', () => {
		expect(parse('titleSize=xl').titleSize).toBe('xl');
		expect(parse('titleSize=64').titleSize).toBe(64);
	});

	it('keeps title sizes in a sensible range', () => {
		expect(parse('titleSize=1').titleSize).toBe(16);
		expect(parse('titleSize=99999').titleSize).toBe(300);
		expect(parse('titleSize=-5').titleSize).toBe('l');
		expect(parse('titleSize=huge').titleSize).toBe('l');
		expect(parse('titleSize=Infinity').titleSize).toBe('l');
	});

	it('reads booleans', () => {
		expect(parse('logo=false').logo).toBe(false);
		expect(parse('logo=0').logo).toBe(false);
		expect(parse('logo=true').logo).toBe(true);
		expect(parse('wrap=true').wrap).toBe(true);
		expect(parse('wrap=false').wrap).toBe(false);
		expect(parse('wrap').wrap).toBe(true);
	});

	it('limits how much text is drawn', () => {
		const long = 'x'.repeat(5000);
		expect(parse(`title=${long}`).title).toHaveLength(MAX_TITLE_LENGTH);
		expect(parse(`subtitle=${long}`).subtitle).toHaveLength(MAX_SUBTITLE_LENGTH);
	});

	it("doesn't split emoji when limiting text", () => {
		const { title } = parse(`title=${encodeURIComponent('😀'.repeat(200))}`);
		expect([...title]).toHaveLength(MAX_TITLE_LENGTH);
		expect(title.isWellFormed()).toBe(true);
	});

	it('removes control characters but keeps newlines', () => {
		expect(parse('title=a%00b%1Bc%0Ad').title).toBe('abc\nd');
		expect(parse('title=a%0D%0Ab').title).toBe('a\nb');
	});

	it('falls back on a blank title', () => {
		expect(parse('title=%20%20').title).toBe('TITLE');
	});

	it('limits the number of badges', () => {
		const query = Array.from({ length: 20 }, (_, i) => `badge=${i}`).join('&');
		expect(parse(query).badges).toHaveLength(MAX_BADGES);
	});
});

describe('toQuery', () => {
	it('leaves out defaults', () => {
		expect(
			toQuery({ title: 'A', template: 'rjm', format: 'banner', titleSize: 'l', logo: true })
		).toBe('title=A');
	});

	it('round-trips through parseOptions', () => {
		const options = parse(
			'title=A%20%26%20B&subtitle=C&template=aurora&format=square&align=center&titleSize=64&wrap=false&logo=false&primary=%23111111&secondary=%23222222&badge=https%3A%2F%2Fa.example%2Fb.svg%3Fx%3D1&badge=https%3A%2F%2Fc.example%2Fd.svg'
		);
		expect(parse(toQuery(options))).toEqual(options);
	});
});
