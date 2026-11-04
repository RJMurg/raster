import { MAX_SUBTITLE_LENGTH, MAX_TITLE_LENGTH, clean, oneOf } from './options.ts';

/** The same set as GitHub's alerts, and the titles they get unless told otherwise */
export const NOTICE_TYPES = {
	note: 'Note',
	tip: 'Tip',
	important: 'Important',
	warning: 'Warning',
	caution: 'Caution'
} as const;
export type NoticeType = keyof typeof NOTICE_TYPES;

export const NOTICE_THEMES = { dark: 'Dark', light: 'Light' } as const;
export type NoticeTheme = keyof typeof NOTICE_THEMES;

export interface NoticeOptions {
	type: NoticeType;
	title: string;
	message: string;
	theme: NoticeTheme;
}

/** Like `parseOptions`, anything invalid falls back to its default */
export function parseNotice(params: URLSearchParams): NoticeOptions {
	// GitHub writes these in capitals, so that's likely to be typed here too
	const type = oneOf(params.get('type')?.toLowerCase() ?? null, NOTICE_TYPES) ?? 'note';

	return {
		type,
		title: clean(params.get('title'), MAX_TITLE_LENGTH) || NOTICE_TYPES[type],
		message: clean(params.get('message'), MAX_SUBTITLE_LENGTH),
		theme: oneOf(params.get('theme'), NOTICE_THEMES) ?? 'dark'
	};
}

/** The query string for a notice, leaving out anything at its default */
export function noticeQuery({ type, title, message, theme }: Partial<NoticeOptions>): string {
	const params = new URLSearchParams();
	if (type && type !== 'note') params.set('type', type);
	if (title && title !== NOTICE_TYPES[type ?? 'note']) params.set('title', title);
	if (message) params.set('message', message);
	if (theme && theme !== 'dark') params.set('theme', theme);
	return params.toString();
}
