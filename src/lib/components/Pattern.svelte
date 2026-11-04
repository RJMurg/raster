<script lang="ts">
	import { cn } from '#lib/utils.js';

	// The diagonal "RJM" wordmark pattern: rows of outlined Montserrat, with one filled
	// highlight row, fading in from the left. `fadeFrom` / `fadeTo` are where the fade starts
	// and ends, as a percentage of the container's width. Set the text size through `class`.
	// `scroll` slides the highlight row along its diagonal, unless the viewer prefers reduced motion;
	// `'hover'` keeps it paused until the nearest `group` ancestor is hovered.
	let {
		fade = true,
		fadeFrom = -37.5,
		fadeTo = 100,
		scroll = false,
		class: className = ''
	}: {
		fade?: boolean;
		fadeFrom?: number;
		fadeTo?: number;
		scroll?: boolean | 'hover';
		class?: string;
	} = $props();

	const id = $props.id();

	// The rows are rotated by ANGLE, so they're sized (in container query units) to the
	// bounding box of the rotated container — W·cos + H·sin by W·sin + H·cos — which covers
	// it at any aspect ratio. Enough rows are rendered to overfill that box at the smallest
	// text size; the extras are clipped, and the highlight row stays in the centre.
	const ANGLE = 26;
	const ROWS = 65;
	const highlightRow = Math.floor(ROWS / 2);
	const cos = Math.cos((ANGLE * Math.PI) / 180).toFixed(4);
	const sin = Math.sin((ANGLE * Math.PI) / 180).toFixed(4);
	const width = `calc(${cos} * 100cqw + ${sin} * 100cqh)`;
	const height = `calc(${sin} * 100cqw + ${cos} * 100cqh)`;

	// The rows are centred on the container, so container x% sits at 50% + (x − 50)cqw along them.
	const toRows = (percent: number) => `calc(50% + ${percent - 50} * 1cqw)`;
	const mask = $derived(
		`linear-gradient(to right, transparent ${toRows(fadeFrom)}, black ${toRows(fadeTo)})`
	);
	const words = Array.from({ length: 24 }, () => 'RJM').join(' ');
</script>

<div
	class={cn(
		'@container-size pointer-events-none relative overflow-hidden bg-black text-[clamp(1.25rem,4vw,3.5rem)] select-none',
		className
	)}
	aria-hidden="true"
>
	<!--
		Montserrat is a variable font whose glyphs are built from overlapping contours, so
		-webkit-text-stroke draws the seams inside each letter. Instead, fill the text and keep
		only a 1px ring outside its silhouette: dilate the alpha, then cut the original away.
	-->
	<svg class="absolute size-0">
		<filter id="{id}-outline">
			<feMorphology in="SourceAlpha" operator="dilate" radius="1" result="grown" />
			<feComposite in="grown" in2="SourceAlpha" operator="out" result="ring" />
			<feFlood flood-color="white" />
			<feComposite in2="ring" operator="in" />
		</filter>
	</svg>
	<div
		class="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col justify-center overflow-hidden font-sans leading-tight font-bold tracking-wide whitespace-nowrap"
		style:width
		style:height
		style:rotate="{ANGLE}deg"
		style:mask-image={fade ? mask : undefined}
	>
		{#each { length: ROWS }, i (i)}
			<span
				class={['block', i === highlightRow ? 'text-brand' : 'text-white opacity-35']}
				style:margin-left="{(i % 2) * 1.2}em"
				style:filter={i === highlightRow ? undefined : `url(#${id}-outline)`}
			>
				{#if scroll && i === highlightRow}
					<!-- Two identical copies, so moving by half the width loops seamlessly -->
					<!-- Important, as the motion-safe animation shorthand is emitted later and resets the play state -->
					<span
						class={[
							'inline-flex motion-safe:animate-pattern-scroll',
							scroll === 'hover' &&
								'[animation-play-state:paused]! group-hover:[animation-play-state:running]!'
						]}
					>
						<span>{words}&nbsp;</span><span>{words}&nbsp;</span>
					</span>
				{:else}
					{words}
				{/if}
			</span>
		{/each}
	</div>
</div>
