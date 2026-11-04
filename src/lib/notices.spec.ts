import { describe, expect, it } from 'vitest';
import { MAX_SUBTITLE_LENGTH } from './options';
import { noticeQuery, parseNotice } from './notices';

const parse = (query: string) => parseNotice(new URLSearchParams(query));

describe('parseNotice', () => {
	it('has defaults for everything', () => {
		expect(parse('')).toEqual({ type: 'note', title: 'Note', message: '', theme: 'dark' });
	});

	it.each([
		['note', 'Note'],
		['tip', 'Tip'],
		['important', 'Important'],
		['warning', 'Warning'],
		['caution', 'Caution']
	])('titles a %s after its type', (type, title) => {
		expect(parse(`type=${type}`)).toMatchObject({ type, title });
	});

	it('accepts types in capitals, as GitHub writes them', () => {
		expect(parse('type=WARNING').type).toBe('warning');
	});

	it.each(['nope', 'toString', '__proto__'])('ignores a type of %s', (type) => {
		expect(parse(`type=${type}`).type).toBe('note');
		expect(parse(`theme=${type}`).theme).toBe('dark');
	});

	it('lets the title be replaced', () => {
		expect(parse('type=warning&title=Deprecated').title).toBe('Deprecated');
	});

	it('limits how much text is drawn', () => {
		expect(parse(`message=${'x'.repeat(5000)}`).message).toHaveLength(MAX_SUBTITLE_LENGTH);
	});

	it('keeps newlines and removes control characters', () => {
		expect(parse('message=a%00b%0Ac').message).toBe('ab\nc');
	});
});

describe('noticeQuery', () => {
	it('leaves out defaults', () => {
		expect(noticeQuery({ type: 'note', title: 'Note', theme: 'dark' })).toBe('');
		expect(noticeQuery({ type: 'warning', title: 'Warning', message: 'Hi' })).toBe(
			'type=warning&message=Hi'
		);
	});

	it('round-trips through parseNotice', () => {
		const options = parse('type=caution&title=A%20%26%20B&message=C%0AD&theme=light');
		expect(parse(noticeQuery(options))).toEqual(options);
	});
});
