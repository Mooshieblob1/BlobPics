<script lang="ts">
	let {
		data
	}: {
		data: {
			gallery: {
				id: string;
				prompt: string;
				previewImageId: string;
				originalImageId: string;
				tags: string[];
				groupedTags?: {
					general: [string, number][];
					character?: any;
					copyright?: any;
					artist?: any;
					meta?: any;
					rating?: any;
					unknown?: any;
				};
			}[];
		};
	} = $props();

	let selected = $state<(typeof data.gallery)[0] | null>(null);
	let searchTerm = $state('');
	let showSuggestions = $state(false);

	const tagCounts = $derived.by(() => {
		return data.gallery.reduce(
			(acc, item) => {
				item.tags.forEach((tag) => {
					acc[tag] = (acc[tag] || 0) + 1;
				});
				return acc;
			},
			{} as Record<string, number>
		);
	});

	const filteredTags = $derived.by(() => {
		return Object.entries(tagCounts)
			.filter(([tag]) => !searchTerm.trim() || tag.toLowerCase().includes(searchTerm.toLowerCase()))
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);
	});

	const filteredGallery = $derived.by(() => {
		return searchTerm
			? data.gallery.filter((item) =>
					item.tags.some((tag) => tag.toLowerCase() === searchTerm.toLowerCase())
				)
			: data.gallery;
	});

	function selectTag(tag: string) {
		searchTerm = tag;
		showSuggestions = false;
	}
</script>

<!-- Header -->
<div
	class="fixed top-0 left-0 z-50 w-full bg-gray-900 px-4 py-3 text-center backdrop-blur-sm md:py-4"
>
	<div class="flex flex-col items-center justify-center gap-2">
		<a href="/" class="inline-block">
			<h1
				class="hover:shadow-glow text-2xl font-bold text-yellow-500 transition duration-300 ease-in-out hover:text-yellow-400 md:text-3xl"
			>
				Blobpics
			</h1>
		</a>
		<a href="/gallery/upload" class="text-sm text-yellow-300 transition hover:text-yellow-200">
			Upload Image
		</a>

		<div class="relative w-full max-w-md">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search for exact tag..."
				class="w-full rounded bg-zinc-800 px-3 py-1 text-white placeholder-zinc-400"
				onfocus={() => (showSuggestions = true)}
				onblur={() => setTimeout(() => (showSuggestions = false), 200)}
				oninput={() => (showSuggestions = true)}
			/>
			{#if showSuggestions && filteredTags.length > 0}
				<div class="absolute z-10 max-h-60 w-full overflow-y-auto rounded bg-zinc-800 shadow-lg">
					{#each filteredTags as [tag, count]}
						<button
							class="flex w-full items-center justify-between px-3 py-2 text-left text-white hover:bg-zinc-700"
							onmousedown={(e) => {
								e.preventDefault();
								selectTag(tag);
							}}
						>
							<span class="truncate">{tag}</span>
							<span class="ml-2 text-sm text-zinc-400">{count}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Gallery -->
<div class="pt-24 md:pt-28">
	<div class="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
		<div class="columns-1 gap-4 sm:columns-2 md:gap-6 lg:columns-3 xl:columns-4 2xl:columns-6">
			{#each filteredGallery as item}
				<button onclick={() => (selected = item)} class="group mb-4 block w-full text-left">
					<picture>
						<source
							srcset={`https://blobpics.tech/cdn-cgi/image/width=480,f=webp/images/${item.previewImageId}`}
							type="image/webp"
						/>
						<img
							src={`https://blobpics.tech/images/${item.previewImageId}`}
							alt={item.prompt}
							draggable={false}
							class="rounded shadow transition group-hover:brightness-50"
							onerror={(e) => {
								const img = e.currentTarget as HTMLImageElement;
								img.src = `https://blobpics.tech/images/${item.previewImageId}`;
							}}
						/>
					</picture>
				</button>
			{/each}
		</div>
	</div>
	{#if filteredGallery.length === 0}
		<div class="py-10 text-center text-white">
			<p>No images found with the exact tag "{searchTerm}"</p>
		</div>
	{/if}
</div>

<!-- Modal -->
{#if selected !== null}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
		onclick={() => (selected = null)}
	>
		<div
			class="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center overflow-hidden rounded bg-zinc-900 p-4 text-white shadow-xl"
			onclick={(e) => e.stopPropagation()}
		>
			<button
				class="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
				onclick={() => (selected = null)}
			>
				✕
			</button>

			<picture>
				<source
					srcset={`https://blobpics.tech/cdn-cgi/image/width=1280,f=webp/images/${selected.originalImageId}`}
					type="image/webp"
				/>
				<img
					src={`https://blobpics.tech/images/${selected.originalImageId}`}
					alt={selected.prompt}
					class="h-auto max-h-[65vh] w-auto max-w-full object-contain"
					onerror={(e) => {
						const img = e.currentTarget as HTMLImageElement;
						img.src = `https://blobpics.tech/images/${selected.originalImageId}`;
					}}
				/>
			</picture>

			<div class="mt-4 flex w-full justify-end">
				<a
					href={`https://blobpics.tech/images/${selected.originalImageId}`}
					target="_blank"
					class="rounded bg-yellow-500 px-3 py-1 text-sm font-bold text-black"
				>
					View Original
				</a>
			</div>

			<div class="mt-3 flex w-full flex-wrap gap-2 font-mono text-xs">
				{#each selected?.tags ?? [] as tag}
					<span
						class="cursor-pointer rounded bg-zinc-700 px-2 py-1 hover:bg-zinc-600"
						onclick={() => {
							searchTerm = tag;
							selected = null;
						}}>{tag}</span
					>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.hover\:shadow-glow:hover {
		text-shadow:
			0 0 10px rgba(250, 204, 21, 0.7),
			0 0 20px rgba(250, 204, 21, 0.5),
			0 0 30px rgba(250, 204, 21, 0.3);
	}
</style>
