import { TEMPLATES, type TemplateId } from './templates.ts';

export const FORMATS = {
	banner: { name: 'README banner', width: 2072, height: 256 },
	og: { name: 'Link preview', width: 1200, height: 630 },
	square: { name: 'Square (Twitter)', width: 1200, height: 1200 }
} as const;
export type Format = keyof typeof FORMATS;

export const TITLE_SIZES = { s: 0.65, m: 0.8, l: 1, xl: 1.25 } as const;
export type TitleSize = keyof typeof TITLE_SIZES | number;

export type Align = 'left' | 'center';

export const MAX_TITLE_LENGTH = 120;
export const MAX_SUBTITLE_LENGTH = 500;
export const MAX_BADGES = 6;
const MIN_TITLE_PX = 16;
const MAX_TITLE_PX = 300;

export interface HeaderOptions {
	title: string;
	subtitle: string;
	template: TemplateId;
	format: Format;
	/** The template's choice when unset */
	align?: Align;
	titleSize: TitleSize;
	/** Banners keep titles on one line and the taller formats wrap them, when unset */
	wrap?: boolean;
	/** Whether to draw the template's RJM pattern */
	logo: boolean;
	primary?: string;
	secondary?: string;
	badges: string[];
}

const COLOR = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const color = (value: string | null) => {
	if (!value) return undefined;
	// A # has to be %23 in a URL, and it's easy to get wrong, so bare hex works too
	const hex = value.startsWith('#') ? value : `#${value}`;
	return COLOR.test(hex) ? hex : undefined;
};

const bool = (value: string | null) => {
	if (value === null) return undefined;
	return !['false', '0', 'no', 'off'].includes(value.toLowerCase());
};

export const oneOf = <T extends string>(value: string | null, options: Record<T, unknown>) =>
	value !== null && Object.hasOwn(options, value) ? (value as T) : undefined;

/** Control characters are dropped, and newlines are kept as they force a line break */
export const clean = (value: string | null, maxLength: number) =>
	[...(value ?? '').replace(/\r\n?/g, '\n').replace(/[^\P{Cc}\n]/gu, '')]
		.slice(0, maxLength)
		.join('')
		.trim();

function titleSize(value: string | null): TitleSize {
	const named = oneOf(value, TITLE_SIZES);
	if (named) return named;
	const px = Number(value);
	if (!value || !Number.isFinite(px) || px <= 0) return 'l';
	return Math.min(Math.max(Math.round(px), MIN_TITLE_PX), MAX_TITLE_PX);
}

/**
 * Reads the options out of a query string. These URLs end up pasted into READMEs where nobody
 * sees an error, so anything invalid falls back to its default rather than failing the image.
 */
export function parseOptions(params: URLSearchParams): HeaderOptions {
	return {
		title: clean(params.get('title'), MAX_TITLE_LENGTH) || 'TITLE',
		subtitle: clean(params.get('subtitle'), MAX_SUBTITLE_LENGTH),
		template: oneOf(params.get('template'), TEMPLATES) ?? 'rjm',
		format: oneOf(params.get('format'), FORMATS) ?? 'banner',
		align: oneOf(params.get('align'), { left: true, center: true }),
		titleSize: titleSize(params.get('titleSize')),
		wrap: bool(params.get('wrap')),
		logo: bool(params.get('logo')) ?? true,
		primary: color(params.get('primary')),
		secondary: color(params.get('secondary')),
		badges: params.getAll('badge').filter(Boolean).slice(0, MAX_BADGES)
	};
}

/** The query string for some options, leaving out anything at its default */
export function toQuery(options: Partial<HeaderOptions>): string {
	const params = new URLSearchParams();
	if (options.title) params.set('title', options.title);
	if (options.subtitle) params.set('subtitle', options.subtitle);
	if (options.template && options.template !== 'rjm') params.set('template', options.template);
	if (options.format && options.format !== 'banner') params.set('format', options.format);
	if (options.align) params.set('align', options.align);
	if (options.titleSize && options.titleSize !== 'l') {
		params.set('titleSize', String(options.titleSize));
	}
	if (options.wrap !== undefined) params.set('wrap', String(options.wrap));
	if (options.logo === false) params.set('logo', 'false');
	if (options.primary) params.set('primary', options.primary);
	if (options.secondary) params.set('secondary', options.secondary);
	for (const badge of options.badges ?? []) params.append('badge', badge);
	return params.toString();
}
