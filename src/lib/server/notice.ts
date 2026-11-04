import type { NoticeOptions, NoticeTheme, NoticeType } from '#lib/notices.js';
import type { TextStyle } from '#lib/templates.js';
import { draw, h, lines, textStyle } from './draw';
import { measurer } from './fonts';
import { flow, type Block } from './layout';

// Twice the width of a README, so that it stays sharp on high density screens
export const WIDTH = 1600;
const PADDING = { x: 44, y: 36 };
const BAR_WIDTH = 12;
const ICON_SIZE = 44;
const ICON_GAP = 18;
const GAP = 14;

const TITLE: TextStyle = { font: 'Montserrat', weight: 900 };
const TITLE_SIZE = 38;
const TITLE_LINE_HEIGHT = 1.2;
const MESSAGE: TextStyle = { font: 'Montserrat', weight: 300 };
const MESSAGE_SIZE = 34;
const MESSAGE_LINE_HEIGHT = 1.4;

const THEMES: Record<NoticeTheme, { background: string; text: string }> = {
	dark: { background: '#0d1117', text: '#e6edf3' },
	light: { background: '#ffffff', text: '#1f2328' }
};

/** GitHub's alert colours, which are picked to be readable on each theme */
const COLORS: Record<NoticeType, Record<NoticeTheme, string>> = {
	note: { dark: '#4493f8', light: '#0969da' },
	tip: { dark: '#3fb950', light: '#1a7f37' },
	important: { dark: '#ab7df8', light: '#8250df' },
	warning: { dark: '#d29922', light: '#9a6700' },
	caution: { dark: '#f85149', light: '#d1242f' }
};

// Lucide's info, lightbulb, message-square-warning, triangle-alert and octagon-alert
const ICONS: Record<NoticeType, string> = {
	note: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
	tip: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
	important:
		'<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M12 15h.01"/><path d="M12 7v4"/>',
	warning:
		'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
	caution:
		'<path d="M12 16h.01"/><path d="M12 8v4"/><path d="M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"/>'
};

const icon = (type: NoticeType, color: string) => {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[type]}</svg>`;
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
};

const block = (
	text: string,
	width: number,
	style: TextStyle,
	size: number,
	lineHeight: number
) => ({
	size,
	lineHeight,
	lines: flow(text, width, size, measurer(style))
});

const blockHeight = ({ size, lineHeight, lines }: Block) =>
	Math.ceil(size * lineHeight) * lines.length;

/** The tree of elements for a notice, and how tall it came out */
export function buildNotice({ type, title, message, theme }: NoticeOptions) {
	const color = COLORS[type][theme];
	const { background, text } = THEMES[theme];

	const textWidth = WIDTH - BAR_WIDTH - PADDING.x * 2;
	const titleBlock = block(
		title,
		textWidth - ICON_SIZE - ICON_GAP,
		TITLE,
		TITLE_SIZE,
		TITLE_LINE_HEIGHT
	);
	const messageBlock = block(message, textWidth, MESSAGE, MESSAGE_SIZE, MESSAGE_LINE_HEIGHT);

	const headingHeight = Math.max(ICON_SIZE, blockHeight(titleBlock));
	const height =
		PADDING.y * 2 +
		headingHeight +
		(messageBlock.lines.length ? GAP + blockHeight(messageBlock) : 0);

	const tree = h('div', { display: 'flex', width: WIDTH, height, backgroundColor: background }, [
		h('div', { width: BAR_WIDTH, height, backgroundColor: color }),
		h(
			'div',
			{
				display: 'flex',
				flexDirection: 'column',
				gap: GAP,
				width: WIDTH - BAR_WIDTH,
				height,
				padding: `${PADDING.y}px ${PADDING.x}px`,
				// A wash of the notice's colour, so that it stands out from the page around it
				backgroundImage: `linear-gradient(to right, ${color}2e, ${color}0d)`
			},
			[
				h('div', { display: 'flex', alignItems: 'center', gap: ICON_GAP }, [
					{ type: 'img', props: { src: icon(type, color), width: ICON_SIZE, height: ICON_SIZE } },
					h(
						'div',
						{
							display: 'flex',
							flexDirection: 'column',
							...textStyle(TITLE, TITLE_SIZE),
							color
						},
						lines(titleBlock)
					)
				]),
				messageBlock.lines.length
					? h(
							'div',
							{
								display: 'flex',
								flexDirection: 'column',
								...textStyle(MESSAGE, MESSAGE_SIZE),
								color: text
							},
							lines(messageBlock)
						)
					: null
			]
		)
	]);

	return { tree, height };
}

/** Draws a notice as a PNG */
export function renderNotice(options: NoticeOptions) {
	const { tree, height } = buildNotice(options);
	return draw(tree, WIDTH, height);
}
