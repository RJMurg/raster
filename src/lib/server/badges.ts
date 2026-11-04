import { Resvg } from '@resvg/resvg-js';
import { Cache } from './cache';
import { BADGE_FONT, badgeFonts } from './fonts';

/** Hosts badges can be fetched from. Anywhere else needs adding through `BADGE_HOSTS`. */
export const DEFAULT_HOSTS = [
	'img.shields.io',
	'badgen.net',
	'badge.fury.io',
	'github.com',
	'gitlab.com',
	'codecov.io',
	'coveralls.io',
	'api.netlify.com',
	'over.rjm.ie',
	'git.rjm.ie'
];

const MAX_BYTES = 256 * 1024;
const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 3000;
// CI statuses change, but nobody's watching closely enough for this to matter
const CACHE_MS = 5 * 60 * 1000;
const FAILURE_CACHE_MS = 30 * 1000;
/** Drawn at this many times the height they're shown at, so they stay sharp */
const SCALE = 3;

export interface Badge {
	/** A PNG data URL */
	src: string;
	width: number;
	height: number;
}

const cache = new Cache<Badge | null>(256);

/** Only https, and only known hosts: otherwise this could be pointed at the server's own network */
export function allowedUrl(value: string, hosts: readonly string[]) {
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
	return hosts.includes(url.hostname.toLowerCase()) ? url : null;
}

/** Reads a response up to a limit, as Content-Length can be missing or wrong */
async function read(response: Response) {
	const reader = response.body?.getReader();
	if (!reader) return null;

	const chunks: Uint8Array[] = [];
	let size = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) return Buffer.concat(chunks);
		size += value.length;
		if (size > MAX_BYTES) {
			await reader.cancel();
			return null;
		}
		chunks.push(value);
	}
}

/** Redirects are followed by hand so that each hop has to be on an allowed host too */
async function download(url: URL, hosts: readonly string[], fetcher: typeof fetch) {
	let current: URL | null = url;

	for (let hop = 0; current && hop <= MAX_REDIRECTS; hop++) {
		const response: Response = await fetcher(current, {
			redirect: 'manual',
			signal: AbortSignal.timeout(TIMEOUT_MS),
			headers: { accept: 'image/svg+xml,image/png', 'user-agent': 'Raster' }
		});

		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get('location');
			current = location ? allowedUrl(new URL(location, current).href, hosts) : null;
			continue;
		}
		if (!response.ok) return null;

		const body = await read(response);
		return body && { body, type: response.headers.get('content-type') ?? '' };
	}
	return null;
}

/**
 * SVGs can point at other files, which resvg would happily read from this machine's disk. Badges
 * have no need for that, so only embedded images are let through.
 */
export function isSafeSvg(svg: string) {
	if (/<!(?:DOCTYPE|ENTITY)/i.test(svg)) return false;
	const images = svg.match(/<image\b[^>]*>/gi) ?? [];
	return images.every((image) => /\bhref\s*=\s*["']\s*data:image\//i.test(image));
}

function rasterise(svg: string, height: number): Badge | null {
	if (!isSafeSvg(svg)) return null;

	const image = new Resvg(svg, {
		fitTo: { mode: 'height', value: height * SCALE },
		font: {
			fontFiles: badgeFonts,
			loadSystemFonts: false,
			defaultFontFamily: BADGE_FONT,
			sansSerifFamily: BADGE_FONT
		}
	}).render();

	return {
		src: `data:image/png;base64,${image.asPng().toString('base64')}`,
		width: Math.round(image.width / SCALE),
		height
	};
}

const PNG_SIGNATURE = '89504e470d0a1a0a';

function embed(png: Buffer, height: number): Badge | null {
	if (png.length < 24 || png.toString('hex', 0, 8) !== PNG_SIGNATURE) return null;
	const [naturalWidth, naturalHeight] = [png.readUInt32BE(16), png.readUInt32BE(20)];
	if (!naturalWidth || !naturalHeight) return null;

	return {
		src: `data:image/png;base64,${png.toString('base64')}`,
		width: Math.round((naturalWidth / naturalHeight) * height),
		height
	};
}

async function load(url: URL, height: number, hosts: readonly string[], fetcher: typeof fetch) {
	const file = await download(url, hosts, fetcher);
	if (!file) return null;
	if (file.type.includes('svg')) return rasterise(file.body.toString('utf8'), height);
	if (file.type.includes('png')) return embed(file.body, height);
	return null;
}

export interface BadgeOptions {
	height: number;
	hosts: readonly string[];
	fetcher?: typeof fetch;
}

/**
 * Fetches badges ready to embed, in the order given. A badge that can't be loaded is left out
 * rather than failing the whole image: `failed` says whether that happened.
 */
export async function loadBadges(
	urls: string[],
	{ height, hosts, fetcher = fetch }: BadgeOptions
): Promise<{ badges: Badge[]; failed: boolean }> {
	const results = await Promise.all(
		urls.map(async (value) => {
			const url = allowedUrl(value, hosts);
			if (!url) return null;

			const key = `${height}:${url.href}`;
			const cached = cache.get(key);
			if (cached !== undefined) return cached;

			const badge = await load(url, height, hosts, fetcher).catch((error) => {
				console.warn(`Couldn't load badge ${url.href}:`, error);
				return null;
			});
			cache.set(key, badge, badge ? CACHE_MS : FAILURE_CACHE_MS);
			return badge;
		})
	);

	const badges = results.filter((badge) => badge !== null);
	return { badges, failed: badges.length < urls.length };
}
