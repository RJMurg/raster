<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import { env as publicEnv } from '$env/dynamic/public';
	import favicon from '$lib/assets/favicon.svg';

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

	{#if publicEnv.PUBLIC_ENABLE_ANALYTICS}
		<script
			src={publicEnv.PUBLIC_ANALYTICS_LINK}
			data-site-id={publicEnv.PUBLIC_ANALYTICS_ID}
			defer
		>
		</script>
	{/if}
</svelte:head>

<ModeWatcher />
{@render children()}
