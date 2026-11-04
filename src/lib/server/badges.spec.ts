import { describe, expect, it, vi } from 'vitest';
import { allowedUrl, isSafeSvg, loadBadges } from './badges';

const HOSTS = ['badges.example', 'cdn.example'];
const SVG =
	'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="20"><rect width="80" height="20" fill="#0f0"/><text x="4" y="14" font-family="Verdana,sans-serif" font-size="11">ok</text></svg>';

// A 1x1 PNG, then the same again claiming to be 40x10 for the sake of working out its width
const PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
	'base64'
);

const respond = (body: BodyInit | null, type: string, init: ResponseInit = {}) =>
	new Response(body, { headers: { 'content-type': type }, ...init });

// Each test needs its own URL, as loaded badges are cached
let id = 0;
const url = (host = 'badges.example') => `https://${host}/badge-${id++}.svg`;

const load = (urls: string[], fetcher: typeof fetch) =>
	loadBadges(urls, { height: 28, hosts: HOSTS, fetcher });

describe('allowedUrl', () => {
	it('allows https on a listed host', () => {
		expect(allowedUrl('https://badges.example/a.svg', HOSTS)?.hostname).toBe('badges.example');
		expect(allowedUrl('https://BADGES.example/a.svg', HOSTS)).not.toBeNull();
	});

	it.each([
		['http', 'http://badges.example/a.svg'],
		['file', 'file:///etc/passwd'],
		['data', 'data:image/svg+xml,<svg/>'],
		['an unlisted host', 'https://evil.example/a.svg'],
		['a lookalike host', 'https://badges.example.evil.example/a.svg'],
		['a subdomain', 'https://sub.badges.example/a.svg'],
		['credentials', 'https://badges.example@evil.example/a.svg'],
		['a username', 'https://user:pass@badges.example/a.svg'],
		['a port', 'https://badges.example:8443/a.svg'],
		['localhost', 'https://localhost/a.svg'],
		['metadata endpoints', 'https://169.254.169.254/latest/meta-data'],
		['nonsense', 'not a url']
	])('refuses %s', (_, value) => {
		expect(allowedUrl(value, HOSTS)).toBeNull();
	});
});

describe('isSafeSvg', () => {
	it('allows plain badges', () => {
		expect(isSafeSvg(SVG)).toBe(true);
	});

	it('allows embedded logos, as shields.io uses', () => {
		expect(isSafeSvg('<svg><image x="5" href="data:image/png;base64,AAAA"/></svg>')).toBe(true);
		expect(isSafeSvg('<svg><image xlink:href="data:image/svg+xml;base64,AAAA"/></svg>')).toBe(true);
	});

	it("allows links, which aren't followed", () => {
		expect(isSafeSvg('<svg><a href="https://example.com"><rect/></a></svg>')).toBe(true);
	});

	it.each([
		['files', '<svg><image href="/etc/secret.png"/></svg>'],
		['file URLs', '<svg><image href="file:///etc/secret.png"/></svg>'],
		['xlink files', '<svg><image xlink:href="/etc/secret.png"/></svg>'],
		['remote images', '<svg><image href="https://internal.example/a.png"/></svg>'],
		['images with no href', '<svg><image/></svg>'],
		['entities', '<!DOCTYPE svg [<!ENTITY x "y">]><svg>&x;</svg>']
	])('refuses %s', (_, svg) => {
		expect(isSafeSvg(svg)).toBe(false);
	});
});

describe('loadBadges', () => {
	it('turns SVGs into PNGs at the requested height', async () => {
		const { badges, failed } = await load([url()], async () => respond(SVG, 'image/svg+xml'));

		expect(failed).toBe(false);
		expect(badges).toHaveLength(1);
		expect(badges[0].src).toMatch(/^data:image\/png;base64,/);
		expect(badges[0].height).toBe(28);
		// 80x20 keeps its shape
		expect(badges[0].width).toBe(112);
	});

	it('embeds PNGs', async () => {
		const { badges } = await load([url()], async () => respond(PNG, 'image/png'));
		expect(badges[0]).toMatchObject({ width: 28, height: 28 });
	});

	it('keeps the order given', async () => {
		const wide = SVG.replace('width="80"', 'width="160"');
		const [first, second] = [url(), url()];
		const { badges } = await load([first, second], async (input) =>
			respond(String(input) === first ? wide : SVG, 'image/svg+xml')
		);
		expect(badges.map((badge) => badge.width)).toEqual([224, 112]);
	});

	it('never fetches hosts that are not allowed', async () => {
		const fetcher = vi.fn<typeof fetch>();
		const { badges, failed } = await load(['https://evil.example/a.svg'], fetcher);

		expect(fetcher).not.toHaveBeenCalled();
		expect(badges).toEqual([]);
		expect(failed).toBe(true);
	});

	it('follows redirects between allowed hosts', async () => {
		const target = url('cdn.example');
		const fetcher = vi.fn<typeof fetch>(async (input) =>
			String(input) === target
				? respond(SVG, 'image/svg+xml')
				: respond(null, 'text/plain', {
						status: 302,
						headers: { location: target }
					})
		);

		const { badges } = await load([url()], fetcher);
		expect(fetcher).toHaveBeenCalledTimes(2);
		expect(badges).toHaveLength(1);
	});

	it("won't be redirected off the allowed hosts", async () => {
		const fetcher = vi.fn<typeof fetch>(async () =>
			respond(null, 'text/plain', {
				status: 302,
				headers: { location: 'https://169.254.169.254/latest/meta-data' }
			})
		);

		const { badges, failed } = await load([url()], fetcher);
		expect(fetcher).toHaveBeenCalledTimes(1);
		expect(badges).toEqual([]);
		expect(failed).toBe(true);
	});

	it('gives up on redirect loops', async () => {
		const target = url();
		const fetcher = vi.fn<typeof fetch>(async () =>
			respond(null, 'text/plain', { status: 302, headers: { location: target } })
		);

		expect((await load([target], fetcher)).failed).toBe(true);
		expect(fetcher).toHaveBeenCalledTimes(4);
	});

	it('refuses huge responses', async () => {
		const huge = 'x'.repeat(300 * 1024);
		const { failed } = await load([url()], async () => respond(huge, 'image/svg+xml'));
		expect(failed).toBe(true);
	});

	it('refuses other content types', async () => {
		const { failed } = await load([url()], async () => respond('<html></html>', 'text/html'));
		expect(failed).toBe(true);
	});

	it('refuses SVGs pointing at files', async () => {
		const svg = SVG.replace('<rect', '<image href="/etc/secret.png"/><rect');
		const { failed } = await load([url()], async () => respond(svg, 'image/svg+xml'));
		expect(failed).toBe(true);
	});

	it('refuses things that only claim to be PNGs', async () => {
		const { failed } = await load([url()], async () => respond('not a png', 'image/png'));
		expect(failed).toBe(true);
	});

	it('survives invalid SVGs', async () => {
		const { failed } = await load([url()], async () => respond('<svg', 'image/svg+xml'));
		expect(failed).toBe(true);
	});

	it('survives failed requests, keeping the badges that worked', async () => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		const [good, bad] = [url(), url()];
		const { badges, failed } = await load([bad, good], async (input) => {
			if (String(input) === bad) throw new Error('timeout');
			return respond(SVG, 'image/svg+xml');
		});

		expect(badges).toHaveLength(1);
		expect(failed).toBe(true);
	});

	it('survives errors from the host', async () => {
		const { failed } = await load([url()], async () =>
			respond('nope', 'image/svg+xml', { status: 500 })
		);
		expect(failed).toBe(true);
	});

	it('only fetches a badge once', async () => {
		const target = url();
		const fetcher = vi.fn<typeof fetch>(async () => respond(SVG, 'image/svg+xml'));

		await load([target], fetcher);
		await load([target], fetcher);
		expect(fetcher).toHaveBeenCalledTimes(1);
	});
});
