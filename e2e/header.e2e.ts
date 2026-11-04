import { readFileSync } from 'node:fs';
import { expect, test, type APIResponse } from '@playwright/test';

const size = async (response: APIResponse) => {
	const png = await response.body();
	return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
};

test('serves the old style of URL', async ({ request }) => {
	const response = await request.get('/raster/header?title=RASTER&subtitle=Hello');

	expect(response.status()).toBe(200);
	expect(response.headers()['content-type']).toBe('image/png');
	expect(response.headers()['cache-control']).toBe('public, max-age=3600');
	expect(await size(response)).toEqual({ width: 2072, height: 256 });
});

test('serves square images', async ({ request }) => {
	const response = await request.get('/raster/header?title=RASTER&format=square');
	expect(await size(response)).toEqual({ width: 1200, height: 1200 });
});

test('serves images whatever the query says', async ({ request }) => {
	const response = await request.get(
		'/raster/header?template=nope&format=nope&primary=nope&titleSize=nope&align=nope&badge=nope'
	);
	expect(response.status()).toBe(200);
});

test('still serves the image when a badge is not allowed', async ({ request }) => {
	const response = await request.get(
		`/raster/header?title=A&badge=${encodeURIComponent('https://169.254.169.254/latest')}`
	);
	expect(response.status()).toBe(200);
	// It might be worth trying again sooner, as a failed badge could be a temporary one
	expect(response.headers()['cache-control']).toBe('public, max-age=30');
});

test('every example in the README renders', async ({ request }) => {
	const readme = readFileSync('README.md', 'utf8');
	const urls = readme.match(/https:\/\/api\.murga\.cloud\/raster\/header\?[^\s)"]+/g) ?? [];
	expect(urls.length).toBeGreaterThan(20);

	for (const url of new Set(urls)) {
		// Badges are left out as this shouldn't depend on other people's servers being up
		const query = new URLSearchParams(new URL(url).search);
		query.delete('badge');
		const response = await request.get(`/raster/header?${query}`);
		expect(response.status(), url).toBe(200);
	}
});
