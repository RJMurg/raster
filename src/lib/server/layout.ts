/** How wide some text is at a font size */
export type Measure = (text: string, size: number) => number;

const ELLIPSIS = '…';
/** satori's shaping isn't quite the same as measuring advances, so leave some room for that */
const SAFETY = 1.02;

/** Greedily fills lines, keeping forced breaks. Words too wide for a line are left overflowing. */
export function wrap(text: string, width: number, size: number, measure: Measure): string[] {
	const lines: string[] = [];

	for (const paragraph of text.split('\n')) {
		let line = '';
		for (const word of paragraph.split(/\s+/).filter(Boolean)) {
			const candidate = line ? `${line} ${word}` : word;
			if (line && measure(candidate, size) > width) {
				lines.push(line);
				line = word;
			} else {
				line = candidate;
			}
		}
		if (line) lines.push(line);
	}
	return lines;
}

/** Splits up any words wider than a line, for when there's no size left to shrink them to */
function breakWords(text: string, width: number, size: number, measure: Measure) {
	return text
		.split('\n')
		.map((paragraph) =>
			paragraph
				.split(/\s+/)
				.flatMap((word) => {
					const pieces: string[] = [];
					let piece = '';
					for (const char of word) {
						if (piece && measure(piece + char, size) > width) {
							pieces.push(piece);
							piece = char;
						} else {
							piece += char;
						}
					}
					return piece ? [...pieces, piece] : pieces;
				})
				.join(' ')
		)
		.join('\n');
}

/** The narrowest wrapping with the same number of lines, so the last line isn't left stranded */
export function balance(text: string, width: number, size: number, measure: Measure) {
	const target = wrap(text, width, size, measure).length;
	if (target < 2) return wrap(text, width, size, measure);

	let [low, high] = [width / target, width];
	while (high - low > 1) {
		const middle = (low + high) / 2;
		if (wrap(text, middle, size, measure).length > target) low = middle;
		else high = middle;
	}
	return wrap(text, high, size, measure);
}

/** Cuts lines down to a maximum, ending on an ellipsis if anything was lost */
export function clamp(
	lines: string[],
	maxLines: number,
	width: number,
	size: number,
	measure: Measure
) {
	if (lines.length <= maxLines) return lines;
	if (maxLines <= 0) return [];

	const kept = lines.slice(0, maxLines);
	const words = kept[maxLines - 1].split(' ');
	while (words.length > 1 && measure(words.join(' ') + ELLIPSIS, size) > width) words.pop();

	let last = words.join(' ');
	while (last && measure(last + ELLIPSIS, size) > width) last = last.slice(0, -1);
	kept[maxLines - 1] = last.trimEnd().replace(/[\s,.;:!?-]+$/, '') + ELLIPSIS;
	return kept;
}

export interface Block {
	size: number;
	lineHeight: number;
	lines: string[];
}

export interface TextStyle {
	/** The size to aim for */
	size: number;
	/** The smallest it may go */
	minSize: number;
	/** As a multiple of the size */
	lineHeight: number;
	measure: Measure;
}

export interface FitOptions {
	title: string;
	subtitle: string;
	titleStyle: TextStyle;
	subtitleStyle: TextStyle;
	/** The room to fit into */
	width: number;
	height: number;
	/** Less room beside the subtitle, for the accent */
	subtitleIndent: number;
	/** Whether the title may take more than one line */
	wrapTitle: boolean;
	/** Space taken by the title and subtitle being next to each other, and by anything else */
	gap: number;
	reserved: number;
	/** The height the subtitle will take up, given how tall its text is */
	subtitleHeight?: (textHeight: number) => number;
	/** Whether to even out line lengths */
	balanced: boolean;
}

export interface Fit {
	title: Block;
	subtitle: Block;
	/** The height of everything, including `reserved` */
	height: number;
}

const blockHeight = ({ size, lineHeight, lines }: Block) =>
	Math.ceil(size * lineHeight) * lines.length;

/** Sizes to try, largest first, always ending on the smallest */
function sizes({ size, minSize }: TextStyle) {
	const start = Math.max(size, minSize);
	const step = Math.max(2, Math.round(start / 25));
	const steps: number[] = [];
	for (let current = start; current > minSize; current -= step) steps.push(current);
	return [...steps, minSize];
}

/**
 * Finds the largest text that fits. The subtitle gives way first as it has the most to wrap,
 * and when the text doesn't fit at the smallest sizes, it's cut off with an ellipsis instead.
 * Nothing here can overflow `width` or `height`, whatever text it's given.
 */
export function fit(options: FitOptions): Fit {
	const { title, subtitle, titleStyle, subtitleStyle, width, height, wrapTitle } = options;
	const { subtitleIndent, gap, reserved, subtitleHeight = (textHeight) => textHeight } = options;

	const subtitleWidth = width - subtitleIndent;
	const measureTitle: Measure = (text, size) => titleStyle.measure(text, size) * SAFETY;
	const measureSubtitle: Measure = (text, size) => subtitleStyle.measure(text, size) * SAFETY;

	const titleText = wrapTitle ? title : title.replace(/\s+/g, ' ');
	const lay = options.balanced ? balance : wrap;

	const total = (titleBlock: Block, subtitleBlock: Block) =>
		blockHeight(titleBlock) +
		(subtitleBlock.lines.length ? gap + subtitleHeight(blockHeight(subtitleBlock)) : 0) +
		reserved;

	const fits = (lines: string[], maxWidth: number, size: number, measure: Measure) =>
		lines.every((line) => measure(line, size) <= maxWidth);

	for (const titleSize of sizes(titleStyle)) {
		const lines = wrapTitle ? lay(titleText, width, titleSize, measureTitle) : [titleText];
		if (!fits(lines, width, titleSize, measureTitle)) continue;
		const titleBlock = { size: titleSize, lineHeight: titleStyle.lineHeight, lines };

		for (const subtitleSize of sizes(subtitleStyle)) {
			const subtitleLines = lay(subtitle, subtitleWidth, subtitleSize, measureSubtitle);
			if (!fits(subtitleLines, subtitleWidth, subtitleSize, measureSubtitle)) continue;
			const subtitleBlock = {
				size: subtitleSize,
				lineHeight: subtitleStyle.lineHeight,
				lines: subtitleLines
			};

			const used = total(titleBlock, subtitleBlock);
			if (used <= height) return { title: titleBlock, subtitle: subtitleBlock, height: used };
		}
	}

	// Too much text for the space, so it all goes at its smallest and what doesn't fit is cut
	const size = titleStyle.minSize;
	const titleLineHeight = Math.ceil(size * titleStyle.lineHeight);
	const titleLines = wrap(
		breakWords(titleText, width, size, measureTitle),
		width,
		size,
		measureTitle
	);

	const subtitleSize = subtitleStyle.minSize;
	const subtitleLineHeight = Math.ceil(subtitleSize * subtitleStyle.lineHeight);
	// However long the title is, the subtitle always gets a line
	const subtitleFloor = subtitle ? gap + subtitleHeight(subtitleLineHeight) : 0;
	const maxTitleLines = wrapTitle
		? Math.max(1, Math.floor((height - reserved - subtitleFloor) / titleLineHeight))
		: 1;
	const titleBlock = {
		size,
		lineHeight: titleStyle.lineHeight,
		lines: clamp(titleLines, maxTitleLines, width, size, measureTitle)
	};

	const remaining = height - blockHeight(titleBlock) - gap - reserved;
	let maxLines = Math.max(1, Math.floor(remaining / subtitleLineHeight));
	while (maxLines > 1 && subtitleHeight(maxLines * subtitleLineHeight) > remaining) maxLines--;

	const subtitleBlock = {
		size: subtitleSize,
		lineHeight: subtitleStyle.lineHeight,
		lines: clamp(
			wrap(
				breakWords(subtitle, subtitleWidth, subtitleSize, measureSubtitle),
				subtitleWidth,
				subtitleSize,
				measureSubtitle
			),
			maxLines,
			subtitleWidth,
			subtitleSize,
			measureSubtitle
		)
	};
	return {
		title: titleBlock,
		subtitle: subtitleBlock,
		height: total(titleBlock, subtitleBlock)
	};
}
