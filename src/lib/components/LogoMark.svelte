<script lang="ts">
	// The mark from black.svg / white.svg, inlined so it takes `currentColor` and the
	// self-hosted Philosopher face (an <img> of the SVG can't load web fonts).
	let {
		class: className = '',
		label = 'RJM logo',
		style = ''
	}: { class?: string; label?: string; style?: string } = $props();
</script>

<svg
	viewBox="0 0 160 173.72"
	class={className}
	{style}
	role="img"
	aria-label={label}
	fill="currentColor"
	xmlns="http://www.w3.org/2000/svg"
>
	<g font-family="Philosopher, serif" font-weight="700">
		<text font-size="142" transform="translate(50.32 126.86)">r</text>
		<text font-size="36" transform="translate(83.71 126.28)">m</text>
	</g>
	<path
		d="M70.94,52.45c2.27,0,4.14-.71,5.61-2.13,1.47-1.42,2.2-3.36,2.2-5.82,0-3.03-.92-5.58-2.77-7.67-1.85-2.08-4.47-3.12-7.88-3.12-2.27,0-4.14.71-5.61,2.13-1.47,1.42-2.2,3.36-2.2,5.82,0,3.03.92,5.59,2.77,7.67,1.85,2.08,4.47,3.12,7.88,3.12Z"
	/>
	<path
		d="M59.72,67.86c1.32,2.32,1.99,5.89,1.99,10.72v44.73c0,1.23-.02,2.41-.05,3.55h18.43c.05-1.15.08-2.32.08-3.55v-44.73c0-4.83-.38-8.54-1.14-11.15-.76-2.6-2.04-4.47-3.83-5.61-1.8-1.14-4.4-1.7-7.81-1.7h-17.04v4.26h1.42c3.98,0,6.63,1.16,7.95,3.48Z"
	/>
	<path
		d="M61.44,131.14c-.41,5.34-1.29,9.35-2.64,12.05-1.94,3.88-5.14,6.25-9.58,7.1v3.55c7.95,0,14.13-.92,18.53-2.77s7.57-4.95,9.51-9.3c1.25-2.8,2.09-6.35,2.53-10.63h-18.36Z"
	/>
</svg>
