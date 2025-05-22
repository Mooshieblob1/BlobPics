<script lang="ts">
	// Props: Defines the expected data structure for the gallery.
	// `data` is an object containing a `gallery` array.
	// Each gallery item has an id, prompt, image IDs, and tags.
	export let data: {
		gallery: {
			id: string;
			prompt: string;
			previewImageId: string;
			originalImageId: string;
			tags: string[];
		}[];
	};

	// State: Holds the currently selected gallery item for modal display.
	// Null if no item is selected.
	let selected: (typeof data.gallery)[0] | null = null;
	// State: Stores the current search term entered by the user.
	let searchTerm = '';
	// State: Controls the visibility of the tag suggestions dropdown.
	let showSuggestions = false;

	// Configuration: Base URL for Cloudflare R2 Worker.
	// This should be replaced with the actual R2 worker URL.
	const R2_BASE_URL = 'https://your-r2-worker-url.com';

	// Reactive Statement: Calculates the count of each tag across all gallery items.
	// Updates whenever `data.gallery` changes.
	$: tagCounts = data.gallery.reduce(
		(acc, item) => {
			item.tags.forEach((tag) => {
				acc[tag] = (acc[tag] || 0) + 1;
			});
			return acc;
		},
		{} as Record<string, number>
	);

	// Reactive Statement: Filters and sorts tags based on the search term.
	// Shows top 10 matching tags. Updates when `tagCounts` or `searchTerm` changes.
	$: filteredTags = Object.entries(tagCounts)
		.filter(([tag]) => !searchTerm.trim() || tag.toLowerCase().includes(searchTerm.toLowerCase()))
		.sort((a, b) => b[1] - a[1]) // Sort by count descending
		.slice(0, 10); // Limit to top 10 suggestions

	// Reactive Statement: Filters the gallery items based on the exact search term.
	// If no search term, shows all gallery items. Updates when `searchTerm` or `data.gallery` changes.
	$: filteredGallery = searchTerm
		? data.gallery.filter((item) =>
				item.tags.some((tag) => tag.toLowerCase() === searchTerm.toLowerCase())
			)
		: data.gallery;

	// Function: Sets the search term to the selected tag and hides suggestions.
	function selectTag(tag: string) {
		searchTerm = tag;
		showSuggestions = false;
	}
</script>

<!-- Header Section: Fixed at the top, contains title and search bar. -->
<div
	class="fixed top-0 left-0 z-50 w-full bg-gray-900 px-4 py-3 text-center backdrop-blur-sm md:py-4"
>
	<div class="flex flex-col items-center justify-center gap-2">
		<!-- Site Title/Logo -->
		<a href="/" class="inline-block">
			<h1
				class="hover:shadow-glow text-2xl font-bold text-yellow-500 transition duration-300 ease-in-out hover:text-yellow-400 md:text-3xl"
			>
				Blobpics
			</h1>
		</a>
		<!-- Search Input and Suggestions Container -->
		<div class="relative w-full max-w-md">
			<!-- Search Input Field -->
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search for exact tag..."
				class="w-full rounded bg-zinc-800 px-3 py-1 text-white placeholder-zinc-400"
				on:focus={() => (showSuggestions = true)}
				on:blur={() => setTimeout(() => (showSuggestions = false), 200)}
				on:input={() => (showSuggestions = true)}
			/>
			<!-- Tag Suggestions Dropdown -->
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

<!-- Main Content Area: Padded to account for the fixed header. -->
<div class="pt-24 md:pt-28">
	<!-- Gallery Grid Container -->
	<div class="mx-auto max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
		<!-- Masonry Layout for Gallery Items -->
		<div class="columns-1 gap-4 sm:columns-2 md:gap-6 lg:columns-3 xl:columns-4 2xl:columns-6">
			{#each filteredGallery as item}
				<!-- Individual Gallery Item (Clickable) -->
				<button on:click={() => (selected = item)} class="group mb-4 block w-full text-left">
					<img
						src={`${R2_BASE_URL}/${item.previewImageId}`}
						alt={item.prompt}
						draggable={false}
						class="rounded shadow transition group-hover:brightness-50"
					/>
				</button>
			{/each}
		</div>
	</div>
	<!-- Message for No Search Results -->
	{#if filteredGallery.length === 0}
		<div class="py-10 text-center text-white">
			<p>No images found with the exact tag "{searchTerm}"</p>
		</div>
	{/if}
</div>

<!-- Modal for Selected Image -->
{#if selected}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4"
		on:click={() => (selected = null)}
	>
		<!-- Modal Content Container -->
		<div
			class="relative flex max-h-[90vh] w-full max-w-5xl flex-col items-center overflow-hidden rounded bg-zinc-900 p-4 text-white shadow-xl"
			on:click|stopPropagation
		>
			<!-- Close Button for Modal -->
			<button
				class="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
				on:click={() => (selected = null)}
			>
				✕
			</button>

			<!-- Selected Image Display (Responsive) -->
			<img
				src={`${R2_BASE_URL}/${selected.originalImageId}`}
				alt={selected.prompt}
				class="h-auto max-h-[65vh] w-auto max-w-full object-contain"
			/>

			<!-- View Original Image Button -->
			<div class="mt-4 flex w-full justify-end">
				<a
					href={`${R2_BASE_URL}/${selected.originalImageId}`}
					target="_blank"
					class="rounded bg-yellow-500 px-3 py-1 text-sm font-bold text-black"
				>
					View Original
				</a>
			</div>

			<!-- Tags Display for Selected Image -->
			<div class="mt-3 flex w-full flex-wrap gap-2 font-mono text-xs">
				{#each selected.tags as tag}
					<span
						class="cursor-pointer rounded bg-zinc-700 px-2 py-1 hover:bg-zinc-600"
						on:click={() => {
							searchTerm = tag; // Set search term to this tag
							selected = null; // Close the modal
						}}>{tag}</span
					>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	/* Custom Style: Adds a glow effect on hover for elements with .hover:shadow-glow class. */
	.hover\\:shadow-glow:hover {
		text-shadow:
			0 0 10px rgba(250, 204, 21, 0.7),
			0 0 20px rgba(250, 204, 21, 0.5),
			0 0 30px rgba(250, 204, 21, 0.3);
	}
</style>
