import { parseNotice } from '#lib/notices.js';
import { Cache } from '#lib/server/cache.js';
import { pngResponse } from '#lib/server/draw.js';
import { renderNotice } from '#lib/server/notice.js';
import type { RequestHandler } from './$types';

const HOUR = 3600;

const cache = new Cache<Uint8Array<ArrayBuffer>>(256);

export const GET: RequestHandler = async ({ url }) => {
	const options = parseNotice(url.searchParams);
	const key = JSON.stringify(options);

	let png = cache.get(key);
	if (!png) {
		png = new Uint8Array(await renderNotice(options));
		cache.set(key, png, HOUR * 1000);
	}
	return pngResponse(png, HOUR);
};
