<script lang="ts">
	export let data: {
		gallery: {
			id: string;
			prompt: string;
			previewImageId: string;
			originalImageId: string;
			tags: string[];
		}[];
	};

	let selected: (typeof data.gallery)[0] | null = null;
	let searchTerm = '';
	let showSuggestions = false;

	// Extract all unique tags with their counts
	$: tagCounts = data.gallery.reduce(
		(acc, item) => {
			item.tags.forEach((tag) => {
				acc[tag] = (acc[tag] || 0) + 1;
			});
			return acc;
		},
		{} as Record<string, number>
	);

	// Show all tags sorted by count when search is empty, or filter them when searching
	$: filteredTags = Object.entries(tagCounts)
		.filter(([tag]) => !searchTerm.trim() || tag.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => b[1] - a[1]) // Sort by count (descending)
		.slice(0, 10); // Limit to 10 suggestions

	// Filter gallery based on exact tag match
	$: filteredGallery = searchTerm
		? data.gallery.filter((item) =>
				item.tags.some((tag) => tag.toLowerCase() === searchTerm.toLowerCase())
			)
		: data.gallery;

	function selectTag(tag: string) {
		searchTerm = tag;
		showSuggestions = false;
	}

	const previewUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682cfa1a0016991596f5/files/${id}/preview?project=682b826b003d9cba9018`;

	const fullUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682b8a3a001fb3d3e9f2/files/${id}/view?project=682b826b003d9cba9018`;
</script>

<!-- Fixed header with translucent background -->
<div
	class="fixed top-0 left-0 z-50 w-full bg-black/70 px-4 py-3 text-center backdrop-blur-sm md:py-4"
>
	<div class="flex flex-col items-center justify-center gap-2">
		<a href="/" class="inline-block">
			<h1
				class="hover:shadow-glow text-2xl font-bold text-yellow-500 transition duration-300 ease-in-out hover:text-yellow-400 md:text-3xl"
			>
				Blobpics
			</h1>
		</a>
		<div class="relative w-full max-w-md">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search for exact tag..."
				class="w-full rounded bg-zinc-800 px-3 py-1 text-white placeholder-zinc-400"
				on:focus={() => (showSuggestions = true)}
				on:blur={() => setTimeout(() => (showSuggestions = false), 200)}
				on:input={() => (showSuggestions = true)}
			/>

			{#if showSuggestions && filteredTags.length > 0}
				<div class="absolute z-10 max-h-60 w-full overflow-y-auto rounded bg-zinc-800 shadow-lg">
					{#each filteredTags as [tag, count]}
						<button
							class="flex w-full items-center justify-between px-3 py-2 text-left text-white hover:bg-zinc-700"
							on:mousedown|preventDefault={() => selectTag(tag)}
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

<!-- Spacer to offset fixed header -->
<div class="pt-24 md:pt-28">
	<!-- Gallery Grid -->
	<div class="columns-1 gap-8 px-4 py-10 sm:columns-2 lg:columns-3">
		{#each filteredGallery as item}
			<button on:click={() => (selected = item)} class="group mb-4 block w-full text-left">
				<img
					src={previewUrl(item.previewImageId)}
					alt={item.prompt}
					draggable={false}
					class="rounded shadow transition group-hover:brightness-110"
				/>
			</button>
		{/each}
	</div>
	{#if filteredGallery.length === 0}
		<div class="py-10 text-center text-white">
			<p>No images found with the exact tag "{searchTerm}"</p>
		</div>
	{/if}
</div>

<!-- Responsive Modal -->
{#if selected}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
		on:click={() => (selected = null)}
	>
		<div
			class="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded bg-zinc-900 p-3 text-white shadow-xl sm:p-4 md:p-6"
			on:click|stopPropagation
		>
			<!-- Close button -->
			<button
				class="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white sm:top-3 sm:right-3 md:top-4 md:right-4"
				on:click={() => (selected = null)}
			>
				✕
			</button>

			<!-- Image container -->
			<div class="mt-2 overflow-hidden rounded">
				<img
					src={fullUrl(selected.originalImageId)}
					alt={selected.prompt}
					class="w-full object-contain"
				/>
			</div>

			<!-- View original button -->
			<div class="mt-3 flex items-center justify-end sm:mt-4">
				<a
					href={fullUrl(selected.originalImageId)}
					target="_blank"
					class="rounded bg-yellow-500 px-3 py-1 text-sm font-bold text-black"
				>
					View Original
				</a>
			</div>

			<!-- Tags -->
			<div class="mt-3 flex flex-wrap gap-2 font-mono text-xs sm:mt-4">
				{#each selected.tags as tag}
					<span
						class="cursor-pointer rounded bg-zinc-700 px-2 py-1 hover:bg-zinc-600"
						on:click={() => {
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
	.hover\\:shadow-glow:hover {
		text-shadow:
			0 0 10px rgba(250, 204, 21, 0.7),
			0 0 20px rgba(250, 204, 21, 0.5),
			0 0 30px rgba(250, 204, 21, 0.3);
	}
</style>
