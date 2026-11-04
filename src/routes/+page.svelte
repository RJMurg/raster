<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		FORMATS,
		TITLE_SIZES,
		toQuery,
		type Align,
		type Format,
		type TitleSize
	} from '#lib/options.js';
	import {
		NOTICE_THEMES,
		NOTICE_TYPES,
		noticeQuery,
		type NoticeTheme,
		type NoticeType
	} from '#lib/notices.js';
	import { TEMPLATES, type TemplateId } from '#lib/templates.js';

	const DEBOUNCE_MS = 250;
	const INPUT =
		'w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none';

	let kind = $state<'header' | 'notice'>('header');

	let title = $state('RASTER');
	let subtitle = $state('A README title image generator');
	let template = $state<TemplateId>('rjm');
	let format = $state<Format>('banner');
	let align = $state<Align | ''>('');
	let titleSize = $state<Exclude<TitleSize, number>>('l');
	let wrap = $state<'' | 'true' | 'false'>('');
	let logo = $state(true);
	let badges = $state('');

	let noticeType = $state<NoticeType>('note');
	let noticeTitle = $state('');
	let message = $state('Useful information that users should know, even when skimming content.');
	let noticeTheme = $state<NoticeTheme>('dark');

	let copied = $state(false);
	let origin = $state('');
	onMount(() => (origin = location.origin));

	const endpoint = resolve('header');
	const query = $derived(
		toQuery({
			title,
			subtitle,
			template,
			format,
			align: align || undefined,
			titleSize,
			wrap: wrap ? wrap === 'true' : undefined,
			logo,
			badges: badges
				.split('\n')
				.map((badge) => badge.trim())
				.filter(Boolean)
		})
	);
	const path = $derived(
		kind === 'header'
			? `${endpoint}?${query}`
			: `${resolve('notice')}?${noticeQuery({
					type: noticeType,
					title: noticeTitle,
					message,
					theme: noticeTheme
				})}`
	);
	// Text in an image can't be read out or searched, so notices repeat theirs in the alt text
	const alt = $derived(
		kind === 'header'
			? title
			: `${noticeTitle || NOTICE_TYPES[noticeType]}: ${message.replace(/\s+/g, ' ')}`
	);
	const markdown = $derived(`![${alt}](${origin}${path})`);

	// The image is drawn by the server, so wait for typing to stop before asking for it
	let preview = $state(`${endpoint}?title=RASTER&subtitle=A+README+title+image+generator`);
	$effect(() => {
		const next = path;
		const timeout = setTimeout(() => (preview = next), DEBOUNCE_MS);
		return () => clearTimeout(timeout);
	});

	async function copy() {
		await navigator.clipboard.writeText(markdown);
		copied = true;
		setTimeout(() => (copied = false), 1500);
	}

	const ogImage = $derived(
		`${page.url.origin}${endpoint}?title=RASTER&subtitle=A+README+title+image+generator&format=og`
	);
</script>

<svelte:head>
	<title>Raster</title>
	<meta name="description" content="A README title image generator" />
	<meta property="og:title" content="Raster" />
	<meta property="og:description" content="A README title image generator" />
	<meta property="og:image" content={ogImage} />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-8 px-4 py-12">
	<header class="flex flex-col gap-2 text-center">
		<h1 class="text-6xl font-black">RASTER</h1>
		<p>A README title image generator</p>
	</header>

	<img
		src={preview}
		alt="Preview of the generated header"
		class="mx-auto max-h-96 max-w-full rounded-md border border-border"
	/>

	<fieldset class="mx-auto flex gap-4 text-sm font-medium">
		<legend class="sr-only">What to generate</legend>
		<label class="flex items-center gap-2">
			<input type="radio" value="header" bind:group={kind} />
			Header
		</label>
		<label class="flex items-center gap-2">
			<input type="radio" value="notice" bind:group={kind} />
			Notice
		</label>
	</fieldset>

	{#if kind === 'notice'}
		<form class="grid gap-4 sm:grid-cols-2" onsubmit={(event) => event.preventDefault()}>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Type
				<select class={INPUT} bind:value={noticeType}>
					{#each Object.entries(NOTICE_TYPES) as [id, name] (id)}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Theme
				<select class={INPUT} bind:value={noticeTheme}>
					{#each Object.entries(NOTICE_THEMES) as [id, name] (id)}
						<option value={id}>{name}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
				Custom title
				<input
					class={INPUT}
					bind:value={noticeTitle}
					maxlength="120"
					placeholder={NOTICE_TYPES[noticeType]}
				/>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
				Message
				<textarea class={INPUT} rows="3" bind:value={message} maxlength="500"></textarea>
			</label>
		</form>
	{:else}
		<form class="grid gap-4 sm:grid-cols-2" onsubmit={(event) => event.preventDefault()}>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Title
				<input class={INPUT} bind:value={title} maxlength="120" />
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Template
				<select class={INPUT} bind:value={template}>
					{#each Object.entries(TEMPLATES) as [id, { name, description }] (id)}
						<option value={id}>{name} – {description}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
				Subtitle
				<textarea class={INPUT} rows="2" bind:value={subtitle} maxlength="500"></textarea>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Format
				<select class={INPUT} bind:value={format}>
					{#each Object.entries(FORMATS) as [id, { name, width, height }] (id)}
						<option value={id}>{name} ({width}×{height})</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Alignment
				<select class={INPUT} bind:value={align}>
					<option value="">Template default</option>
					<option value="left">Left</option>
					<option value="center">Centre</option>
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Title size
				<select class={INPUT} bind:value={titleSize}>
					{#each Object.keys(TITLE_SIZES) as size (size)}
						<option value={size}>{size.toUpperCase()}</option>
					{/each}
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium">
				Title wrapping
				<select class={INPUT} bind:value={wrap}>
					<option value="">Format default</option>
					<option value="true">Wrap</option>
					<option value="false">One line</option>
				</select>
			</label>
			<label class="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
				Badge URLs, one per line
				<textarea
					class={INPUT}
					rows="2"
					bind:value={badges}
					placeholder="https://img.shields.io/badge/build-passing-brightgreen"
				></textarea>
			</label>
			<label class="flex items-center gap-2 text-sm font-medium">
				<input type="checkbox" bind:checked={logo} />
				Show the RJM pattern
			</label>
		</form>
	{/if}

	<section class="flex flex-col gap-2">
		<h2 class="text-sm font-medium">Markdown</h2>
		<code class="rounded-md bg-muted p-3 text-xs break-all">{markdown}</code>
		<button
			type="button"
			class="self-start rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground"
			onclick={copy}
		>
			{copied ? 'Copied' : 'Copy'}
		</button>
	</section>

	<footer class="text-center text-sm">
		Created by <a href="https://rjm.ie" class="text-blue-500 hover:underline">RJM</a>
	</footer>
</main>
