<script lang="ts">
	import './layout.css';
	import {
		PUBLIC_ENABLE_ANALYTICS,
		PUBLIC_ANALYTICS_LINK,
		PUBLIC_ANALYTICS_ID
	} from '$app/env/public';
	import favicon from '#lib/assets/favicon.png';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
		rel="stylesheet"
	/>

	{#if PUBLIC_ENABLE_ANALYTICS}
		<script src={PUBLIC_ANALYTICS_LINK} data-site-id={PUBLIC_ANALYTICS_ID} defer>
		</script>
	{/if}
</svelte:head>

{@render children()}
