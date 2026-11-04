import { describe, expect, it } from 'vitest';
import { Cache } from './cache';

describe('Cache', () => {
	it('gives back what was stored', () => {
		const cache = new Cache<number>(2);
		cache.set('a', 1, 1000);
		expect(cache.get('a')).toBe(1);
		expect(cache.get('b')).toBeUndefined();
	});

	it('expires entries', () => {
		let now = 0;
		const cache = new Cache<number>(2, () => now);
		cache.set('a', 1, 1000);

		now = 999;
		expect(cache.get('a')).toBe(1);
		now = 1000;
		expect(cache.get('a')).toBeUndefined();
	});

	it('drops whatever was used longest ago', () => {
		const cache = new Cache<number>(2);
		cache.set('a', 1, 1000);
		cache.set('b', 2, 1000);
		cache.get('a');
		cache.set('c', 3, 1000);

		expect(cache.get('a')).toBe(1);
		expect(cache.get('b')).toBeUndefined();
		expect(cache.get('c')).toBe(3);
	});

	it('can store null', () => {
		const cache = new Cache<null>(2);
		cache.set('a', null, 1000);
		expect(cache.get('a')).toBeNull();
	});
});
