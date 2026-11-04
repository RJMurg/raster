import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { FORMATS, TITLE_SIZES, type Format, type HeaderOptions } from '#lib/options.js';
import { TEMPLATES, type Template, type TextStyle } from '#lib/templates.js';
import type { Badge } from './badges';
import { fonts, measurer } from './fonts';
import { fit, type Block } from './layout';
import { patternImage } from './pattern';

interface Geometry {
	/** Padding around the text */
	padding: { x: number; y: number };
	/** Where the text has to stop to stay clear of the RJM pattern */
	patternClear: { right?: number; bottom?: number };
	title: { size: number; minSize: number };
	subtitle: { size: number; minSize: number };
	gap: number;
	bar: { width: number; minHeight: number; gap: number };
	rule: { width: number; height: number };
	badge: { height: number; gap: number };
}

const GEOMETRY: Record<Format, Geometry> = {
	banner: {
		padding: { x: 70, y: 18 },
		patternClear: { right: 900 },
		title: { size: 100, minSize: 44 },
		subtitle: { size: 38, minSize: 22 },
		gap: 8,
		bar: { width: 6, minHeight: 80, gap: 30 },
		rule: { width: 120, height: 4 },
		badge: { height: 28, gap: 8 }
	},
	og: {
		padding: { x: 80, y: 64 },
		patternClear: { right: 740 },
		title: { size: 96, minSize: 40 },
		subtitle: { size: 38, minSize: 22 },
		gap: 24,
		bar: { width: 6, minHeight: 80, gap: 28 },
		rule: { width: 120, height: 4 },
		badge: { height: 32, gap: 10 }
	},
	square: {
		padding: { x: 96, y: 96 },
		patternClear: { bottom: 760 },
		title: { size: 136, minSize: 56 },
		subtitle: { size: 48, minSize: 26 },
		gap: 32,
		bar: { width: 8, minHeight: 96, gap: 32 },
		rule: { width: 160, height: 6 },
		badge: { height: 40, gap: 12 }
	}
};

const TITLE_LINE_HEIGHT = 1.15;
const SUBTITLE_LINE_HEIGHT = 1.3;
const BADGE_GAP = 16;
/** The bar sits this far in from the title, which lines it up with the title's first letter */
const BAR_OFFSET = 10;
/** How far a frame's hard shadow reaches */
const SHADOW_ROOM = 10;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: object, children?: Node | (Node | null)[] | string): Node => ({
	type,
	props: { style, children }
});

const textStyle = (style: TextStyle, size: number) => ({
	fontFamily: style.font,
	fontWeight: style.weight,
	fontStyle: style.italic ? 'italic' : 'normal',
	fontSize: size,
	letterSpacing: (style.letterSpacing ?? 0) * size
});

const transform = (style: TextStyle, text: string) => (style.uppercase ? text.toUpperCase() : text);

/** Laid out line by line so that what's drawn is exactly what was measured */
function lines({ size, lineHeight, lines }: Block, center: boolean) {
	return lines.map((line) =>
		h(
			'div',
			{
				display: 'flex',
				justifyContent: center ? 'center' : 'flex-start',
				height: Math.ceil(size * lineHeight),
				lineHeight: `${Math.ceil(size * lineHeight)}px`,
				whiteSpace: 'pre'
			},
			line
		)
	);
}

/** The badges at their full height, or smaller if they'd otherwise be too wide */
function scaleBadges(badges: Badge[], width: number, gap: number) {
	const total = badges.reduce((sum, badge) => sum + badge.width, 0);
	const scale = Math.min(1, (width - gap * (badges.length - 1)) / total);
	return badges.map((badge) => ({
		...badge,
		width: Math.floor(badge.width * scale),
		height: Math.floor(badge.height * scale)
	}));
}

/** The area text goes in, relative to the image */
function textBox(options: HeaderOptions, template: Template, geometry: Geometry) {
	const { width, height } = FORMATS[options.format];
	const inset = template.frame?.inset ?? 0;
	// The frame's border and shadow have to be stepped inside of as well
	const frame = template.frame ? inset + 12 : 0;

	const left = Math.max(geometry.padding.x, frame + 24);
	const top = Math.max(geometry.padding.y, frame + 8);
	let right = width - left;
	let bottom = height - top;

	if (template.pattern && options.logo) {
		right = Math.min(right, geometry.patternClear.right ?? right);
		bottom = Math.min(bottom, geometry.patternClear.bottom ?? bottom);
	}
	return { left, top, width: right - left, height: bottom - top };
}

/** The tree of elements for an image, for satori to draw */
export function buildTree(options: HeaderOptions, badges: Badge[]) {
	const template: Template = TEMPLATES[options.template];
	const geometry = GEOMETRY[options.format];
	const { width, height } = FORMATS[options.format];

	const center = (options.align ?? template.align) === 'center';
	const box = textBox(options, template, geometry);
	const wrapTitle = options.wrap ?? options.format !== 'banner';
	const prefix = template.prompt ?? '';

	const scaled = badges.length ? scaleBadges(badges, box.width, geometry.badge.gap) : [];
	const badgeRowHeight = Math.max(0, ...scaled.map((badge) => badge.height));

	const titleSize =
		typeof options.titleSize === 'number'
			? options.titleSize
			: Math.round(geometry.title.size * TITLE_SIZES[options.titleSize]);

	const accent = center && template.accent === 'bar' ? 'rule' : template.accent;
	const subtitle = transform(template.subtitle, options.subtitle);

	const layout = fit({
		title: prefix + transform(template.title, options.title),
		subtitle,
		titleStyle: {
			size: titleSize,
			minSize: Math.min(titleSize, geometry.title.minSize),
			lineHeight: TITLE_LINE_HEIGHT,
			measure: measurer(template.title)
		},
		subtitleStyle: {
			...geometry.subtitle,
			lineHeight: SUBTITLE_LINE_HEIGHT,
			measure: measurer(template.subtitle)
		},
		width: box.width,
		height: box.height,
		subtitleIndent: accent === 'bar' ? BAR_OFFSET + geometry.bar.width + geometry.bar.gap : 0,
		wrapTitle,
		gap: geometry.gap,
		reserved: badgeRowHeight ? badgeRowHeight + BADGE_GAP : 0,
		subtitleHeight: (textHeight) =>
			accent === 'bar'
				? textHeight + geometry.gap
				: accent === 'rule'
					? textHeight + geometry.rule.height + geometry.gap
					: textHeight,
		balanced: center || wrapTitle
	});

	const titleWidth = Math.ceil(
		Math.max(...layout.title.lines.map((line) => measurer(template.title)(line, layout.title.size)))
	);
	const primary = options.primary ?? template.primary;
	const secondary = options.secondary ?? template.secondary;
	const gradient = (angle: string, from = primary, to = secondary) =>
		`linear-gradient(${angle}, ${from}, ${to})`;

	const titleBlock = h(
		'div',
		{
			display: 'flex',
			flexDirection: 'column',
			// Only as wide as the text, so that all of the gradient is seen. It's a little over in
			// case the text is, as nothing past this edge gets painted
			width: Math.min(titleWidth + 8, box.width),
			...textStyle(template.title, layout.title.size),
			backgroundImage: gradient('to bottom right'),
			backgroundClip: 'text',
			color: 'transparent'
		},
		lines(layout.title, center)
	);

	const subtitleText = h(
		'div',
		{
			display: 'flex',
			flexDirection: 'column',
			...textStyle(template.subtitle, layout.subtitle.size),
			color: template.subtitle.color
		},
		lines(layout.subtitle, center)
	);

	const subtitleLines = layout.subtitle.lines.length > 0;
	const textHeight = Math.ceil(layout.subtitle.size * layout.subtitle.lineHeight);
	// The bar stands taller than short subtitles when there's the room for it
	const barHeight = Math.max(
		textHeight * layout.subtitle.lines.length + geometry.gap,
		Math.min(
			geometry.bar.minHeight,
			box.height - (layout.height - textHeight * layout.subtitle.lines.length - geometry.gap)
		)
	);

	const subtitleBlock = !subtitleLines
		? null
		: accent === 'bar'
			? // The row's height comes from the bar, and the text is centred on it
				h(
					'div',
					{ display: 'flex', alignItems: 'center', gap: geometry.bar.gap, marginLeft: BAR_OFFSET },
					[
						h('div', {
							width: geometry.bar.width,
							height: barHeight,
							borderRadius: geometry.bar.width / 2,
							backgroundImage: gradient('to top')
						}),
						subtitleText
					]
				)
			: accent === 'rule'
				? h(
						'div',
						{
							display: 'flex',
							flexDirection: 'column',
							alignItems: center ? 'center' : 'flex-start',
							gap: geometry.gap
						},
						[
							h('div', {
								width: geometry.rule.width,
								height: geometry.rule.height,
								borderRadius: geometry.rule.height / 2,
								backgroundImage: gradient('to right')
							}),
							subtitleText
						]
					)
				: subtitleText;

	const badgeRow = scaled.length
		? h(
				'div',
				{
					display: 'flex',
					gap: geometry.badge.gap,
					justifyContent: center ? 'center' : 'flex-start',
					marginTop: BADGE_GAP - geometry.gap
				},
				scaled.map((badge) => ({
					type: 'img',
					props: { src: badge.src, width: badge.width, height: badge.height }
				}))
			)
		: null;

	const pattern =
		template.pattern && options.logo
			? {
					type: 'img',
					props: {
						src: patternImage(options.format),
						width,
						height,
						style: { position: 'absolute', left: 0, top: 0 }
					}
				}
			: null;

	const room = template.frame?.shadow ? SHADOW_ROOM : 0;
	const frame = template.frame
		? h('div', {
				position: 'absolute',
				left: template.frame.inset,
				top: template.frame.inset,
				width: width - template.frame.inset * 2 - room,
				height: height - template.frame.inset * 2 - room,
				border: template.frame.border,
				backgroundColor: template.frame.background ?? 'transparent',
				boxShadow: template.frame.shadow
			})
		: null;

	const controls = template.controls
		? h(
				'div',
				{ position: 'absolute', top: 14, right: 20, display: 'flex', gap: 8 },
				['#ff5f57', '#febc2e', '#28c840'].map((color) =>
					h('div', { width: 14, height: 14, borderRadius: 7, backgroundColor: color })
				)
			)
		: null;

	return h(
		'div',
		{
			position: 'relative',
			display: 'flex',
			width,
			height,
			backgroundColor: template.background.color,
			...(template.background.image && { backgroundImage: template.background.image }),
			...(template.background.size && { backgroundSize: template.background.size })
		},
		[
			pattern,
			frame,
			controls,
			h(
				'div',
				{
					position: 'absolute',
					left: box.left,
					top: box.top,
					width: box.width,
					height: box.height,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: center ? 'center' : 'flex-start',
					gap: geometry.gap
				},
				[titleBlock, subtitleBlock, badgeRow]
			)
		]
	);
}

export const badgeHeight = (format: Format) => GEOMETRY[format].badge.height;

/** Draws a header as a PNG */
export async function renderHeader(options: HeaderOptions, badges: Badge[] = []): Promise<Buffer> {
	const { width, height } = FORMATS[options.format];

	// satori's types expect React elements; the plain object tree is what it reads either way
	const tree = buildTree(options, badges) as unknown as Parameters<typeof satori>[0];
	const svg = await satori(tree, { width, height, fonts });

	return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
}
