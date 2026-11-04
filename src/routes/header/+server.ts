import { BADGE_HOSTS } from '$app/env/private';
import { parseOptions } from '#lib/options.js';
import { DEFAULT_HOSTS, loadBadges } from '#lib/server/badges.js';
import { Cache } from '#lib/server/cache.js';
import { badgeHeight, renderHeader } from '#lib/server/render.js';
import type { RequestHandler } from './$types';

const HOUR = 3600;
// Badges show live information like build statuses, so images with them can't be kept for as long
const BADGE_MAX_AGE = 300;
const RETRY_MAX_AGE = 30;

const hosts = [...DEFAULT_HOSTS, ...BADGE_HOSTS];
const cache = new Cache<{ png: Uint8Array<ArrayBuffer>; maxAge: number }>(256);

async function render(params: URLSearchParams) {
	const options = parseOptions(params);
	const key = JSON.stringify(options);

	const cached = cache.get(key);
	if (cached) return cached;

	const { badges, failed } = await loadBadges(options.badges, {
		height: badgeHeight(options.format),
		hosts
	});
	const png = new Uint8Array(await renderHeader(options, badges));
	const maxAge = failed ? RETRY_MAX_AGE : options.badges.length ? BADGE_MAX_AGE : HOUR;

	const result = { png, maxAge };
	cache.set(key, result, maxAge * 1000);
	return result;
}

export const GET: RequestHandler = async ({ url }) => {
	const { png, maxAge } = await render(url.searchParams);

	return new Response(png, {
		headers: {
			'content-type': 'image/png',
			// GitHub and Forgejo proxy README images and respect this
			'cache-control': `public, max-age=${maxAge}`,
			'access-control-allow-origin': '*'
		}
	});
};
