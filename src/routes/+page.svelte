<script lang="ts">
	// Props coming from +page.server.ts
	// The `data` prop contains a gallery array with objects that have `id`, `imageUrl`, and `prompt` properties.
	let {
		data
	}: {
		data: { gallery: { id: string; imageUrl: string; prompt: string }[] };
	} = $props();

	// Function to shuffle the gallery array randomly.
	// This ensures the images are displayed in a random order.
	function shuffleArray<T>(array: T[]): T[] {
		return array
			.map((item) => ({ item, sort: Math.random() })) // Assign a random sort value to each item.
			.sort((a, b) => a.sort - b.sort) // Sort the array based on the random sort value.
			.map(({ item }) => item); // Extract the original items in the new order.
	}

	// Shuffle the gallery array and store it in `shuffledGallery`.
	const shuffledGallery = shuffleArray(data.gallery);

	// Maximum number of columns at largest breakpoint
	const maxColumns = 8;
</script>

<!-- === FULL-SCREEN GRID === -->
<div class="relative h-screen w-screen overflow-hidden bg-black">
	<!-- Grid container for displaying images -->
	<div
		class="absolute inset-0 grid auto-rows-[20vh] grid-cols-2 gap-[2px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
	>
		<!-- Generate a grid of images. The number of images is calculated dynamically. -->
		{#each Array(Math.ceil((100 / 20) * maxColumns)) as _, i}
			<!-- Dynamically set image source and alt text from shuffled gallery -->
			<!-- Disable dragging of images -->
			<img
				src={shuffledGallery[i % shuffledGallery.length].imageUrl}
				alt={shuffledGallery[i % shuffledGallery.length].prompt}
				draggable={false}
				class={`h-full w-full object-cover brightness-[35%] filter motion-safe:animate-[pan_${
					28 + (i % 6) /* Stagger animation duration for each image */
				}s_ease-in-out_infinite]`}
			/>
		{/each}
	</div>

	<!-- === FULL PAGE DARK OVERLAY === -->
	<div class="pointer-events-none absolute inset-0 z-10 bg-black/60"></div>

	<!-- === CENTRE LOGO === -->
	<div class="relative z-20 flex h-full w-full flex-col items-center justify-center">
		<!-- The main logo of the page with a popping animation. -->
		<h1
			class="logo mb-6 text-5xl font-bold text-yellow-400 drop-shadow-[0_0_8px_#fbc21b] select-none sm:text-6xl md:text-7xl 2xl:text-8xl"
		>
			{#each 'BlobPics'.split('') as letter, index}
				<span class="animate-pop inline-block" style="animation-delay: {index * 0.2}s"
					>{letter}</span
				>
			{/each}
		</h1>

		<!-- Gallery button -->
		<a
			href="/gallery"
			class="rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black shadow-lg transition-all duration-300 hover:bg-yellow-500 2xl:px-8 2xl:py-4 2xl:text-xl"
		>
			View Gallery
		</a>
	</div>
</div>

<style>
	/* Slow pan keyframe animation for images.
	   All images use the same animation, but the duration is staggered via inline Tailwind. */
	@keyframes pan {
		0%,
		100% {
			transform: scale(1.1) translate(0, 0); /* Slight zoom and no translation at start/end. */
		}
		50% {
			transform: scale(1.1) translate(-12px, -12px); /* Slight translation at the midpoint. */
		}
	}

	/* Popping animation for each letter */
	@keyframes pop {
		0% {
			transform: scale(1); /* Normal size */
		}
		50% {
			transform: scale(1.3); /* Enlarged size */
		}
		100% {
			transform: scale(1); /* Back to normal size */
		}
	}

	/* Apply the popping animation to each letter */
	.animate-pop {
		animation: pop 1.2s ease-in-out infinite;
		display: inline-block;
	}
</style>
