<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import CheckIcon from '@lucide/svelte/icons/check';
	import CopyIcon from '@lucide/svelte/icons/copy';
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
	import LogoMark from '#lib/components/LogoMark.svelte';
	import Pattern from '#lib/components/Pattern.svelte';

	const DEBOUNCE_MS = 250;
	const INPUT =
		'w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm font-normal text-white transition-colors placeholder:text-neutral-500 hover:border-neutral-700 focus-visible:border-brand focus-visible:ring-1 focus-visible:ring-brand focus-visible:outline-none';
	const SELECT = `${INPUT} select-chevron pr-9`;
	const FIELD = 'flex flex-col gap-1.5 text-sm font-medium text-neutral-400';
	const KINDS = { header: 'Header', notice: 'Notice' } as const;

	let kind = $state<keyof typeof KINDS>('header');

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

	const caption = $derived(
		kind === 'header'
			? {
					name: FORMATS[format].name,
					detail: `${FORMATS[format].width} × ${FORMATS[format].height}`
				}
			: { name: `${NOTICE_THEMES[noticeTheme]} notice`, detail: NOTICE_TYPES[noticeType] }
	);

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

<header class="relative overflow-hidden border-b-4 border-neutral-900">
	<Pattern class="absolute inset-0 opacity-60" scroll />
	<div class="relative mx-auto flex max-w-7xl flex-col gap-16 px-4 py-6 sm:px-8 md:pb-14">
		<a href="https://rjm.ie" rel="external" class="-ml-3.5 self-start">
			<LogoMark class="h-12 w-auto" label="RJM" />
		</a>
		<div>
			<h1 class="text-7xl leading-[0.9] font-black tracking-tight sm:text-8xl lg:text-9xl">
				RASTER
			</h1>
			<p class="mt-6 max-w-xl text-xl font-light md:text-2xl">A README title image generator</p>
		</div>
	</div>
</header>

<main class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-8 md:py-16">
	<figure class="overflow-hidden rounded-xl border border-neutral-800">
		<div class="flex items-center justify-center bg-neutral-950 p-4 sm:min-h-48 sm:p-8">
			<img
				src={preview}
				alt="Preview of the generated header"
				class="max-h-96 max-w-full rounded-md border border-neutral-800"
			/>
		</div>
		<figcaption class="flex justify-between gap-4 border-t border-neutral-800 p-4 text-sm">
			<span class="font-semibold">{caption.name}</span>
			<span class="font-mono text-neutral-500">{caption.detail}</span>
		</figcaption>
	</figure>

	<div class="grid items-start gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
		<div class="flex flex-col gap-6 rounded-xl border border-neutral-800 p-4 sm:p-6">
			<fieldset class="flex rounded-lg border border-neutral-800 p-1 sm:self-start">
				<legend class="sr-only">What to generate</legend>
				{#each Object.entries(KINDS) as [id, name] (id)}
					<label
						class="relative flex-1 rounded-md px-5 py-1.5 text-center text-sm font-medium text-neutral-400 outline-offset-2 outline-brand transition-colors hover:text-white has-checked:bg-brand has-checked:text-black has-focus-visible:outline-2"
					>
						<input
							type="radio"
							class="absolute inset-0 cursor-pointer appearance-none outline-none"
							value={id}
							bind:group={kind}
						/>
						{name}
					</label>
				{/each}
			</fieldset>

			{#if kind === 'notice'}
				<form class="grid gap-4 sm:grid-cols-2" onsubmit={(event) => event.preventDefault()}>
					<label class={FIELD}>
						Type
						<select class={SELECT} bind:value={noticeType}>
							{#each Object.entries(NOTICE_TYPES) as [id, name] (id)}
								<option value={id}>{name}</option>
							{/each}
						</select>
					</label>
					<label class={FIELD}>
						Theme
						<select class={SELECT} bind:value={noticeTheme}>
							{#each Object.entries(NOTICE_THEMES) as [id, name] (id)}
								<option value={id}>{name}</option>
							{/each}
						</select>
					</label>
					<label class="{FIELD} sm:col-span-2">
						Custom title
						<input
							class={INPUT}
							bind:value={noticeTitle}
							maxlength="120"
							placeholder={NOTICE_TYPES[noticeType]}
						/>
					</label>
					<label class="{FIELD} sm:col-span-2">
						Message
						<textarea class={INPUT} rows="3" bind:value={message} maxlength="500"></textarea>
					</label>
				</form>
			{:else}
				<form class="grid gap-4 sm:grid-cols-2" onsubmit={(event) => event.preventDefault()}>
					<label class={FIELD}>
						Title
						<input class={INPUT} bind:value={title} maxlength="120" />
					</label>
					<label class={FIELD}>
						Template
						<select class={SELECT} bind:value={template}>
							{#each Object.entries(TEMPLATES) as [id, { name, description }] (id)}
								<option value={id}>{name} – {description}</option>
							{/each}
						</select>
					</label>
					<label class="{FIELD} sm:col-span-2">
						Subtitle
						<textarea class={INPUT} rows="2" bind:value={subtitle} maxlength="500"></textarea>
					</label>
					<label class={FIELD}>
						Format
						<select class={SELECT} bind:value={format}>
							{#each Object.entries(FORMATS) as [id, { name, width, height }] (id)}
								<option value={id}>{name} ({width}×{height})</option>
							{/each}
						</select>
					</label>
					<label class={FIELD}>
						Alignment
						<select class={SELECT} bind:value={align}>
							<option value="">Template default</option>
							<option value="left">Left</option>
							<option value="center">Centre</option>
						</select>
					</label>
					<label class={FIELD}>
						Title size
						<select class={SELECT} bind:value={titleSize}>
							{#each Object.keys(TITLE_SIZES) as size (size)}
								<option value={size}>{size.toUpperCase()}</option>
							{/each}
						</select>
					</label>
					<label class={FIELD}>
						Title wrapping
						<select class={SELECT} bind:value={wrap}>
							<option value="">Format default</option>
							<option value="true">Wrap</option>
							<option value="false">One line</option>
						</select>
					</label>
					<label class="{FIELD} sm:col-span-2">
						Badge URLs, one per line
						<textarea
							class="{INPUT} font-mono"
							rows="2"
							bind:value={badges}
							placeholder="https://img.shields.io/badge/build-passing-brightgreen"
						></textarea>
					</label>
					<label class="flex items-center gap-2 text-sm font-medium text-neutral-400 sm:col-span-2">
						<input type="checkbox" class="size-4 accent-brand" bind:checked={logo} />
						Show the RJM pattern
					</label>
				</form>
			{/if}
		</div>

		<section class="overflow-hidden rounded-xl border border-neutral-800 lg:sticky lg:top-8">
			<div class="flex items-center justify-between gap-4 border-b border-neutral-800 px-4 py-3">
				<h2 class="font-semibold">Markdown</h2>
				<button
					type="button"
					class="inline-flex cursor-copy items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-semibold text-black outline-offset-2 outline-brand transition-colors focus-visible:outline-2 {copied
						? 'bg-brand'
						: 'bg-white hover:bg-neutral-200'}"
					onclick={copy}
				>
					{#if copied}
						<CheckIcon class="size-4" aria-hidden="true" />
					{:else}
						<CopyIcon class="size-4" aria-hidden="true" />
					{/if}
					<span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
				</button>
			</div>
			<code class="block p-4 font-mono text-sm break-all text-neutral-300">{markdown}</code>
		</section>
	</div>
</main>

<footer class="border-t border-neutral-900 text-sm text-neutral-500">
	<div
		class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8"
	>
		<p class="font-black text-white">RASTER</p>
		<p>Created by <a href="https://rjm.ie" rel="external" class="hover:text-white">RJM</a></p>
	</div>
</footer>
