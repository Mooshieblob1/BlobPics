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
</script>

<!-- === FULL-SCREEN GRID === -->
<div class="relative h-screen w-screen overflow-hidden bg-black">
	<!-- Grid container for displaying images -->
	<div
		class="absolute inset-0 grid auto-rows-[20vh] grid-cols-2 gap-[2px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
	>
		<!-- Generate a grid of images. The number of images is calculated dynamically. -->
		{#each Array(Math.ceil((100 / 20) * 6)) as _, i}
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

	<!-- === SKEWED DARK OVERLAY === -->
	<div class="pointer-events-none absolute inset-0 z-10 overflow-hidden">
		<!-- A dark overlay with a skewed effect to add visual depth. -->
		<div
			class="absolute inset-0 bg-black/60"
			style="transform: skewY(-4deg); transform-origin: top left;"
		></div>
	</div>

	<!-- === CENTRE LOGO === -->
	<div class="relative z-20 flex h-full w-full items-center justify-center">
		<!-- The main logo of the page with a glowing animation. -->
		<h1
			class="animate-logoGlow text-5xl font-bold text-yellow-400 drop-shadow-[0_0_8px_#fbc21b] select-none sm:text-6xl"
		>
			BlobPics
		</h1>
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

	/* Glowing logo pulse animation for the main logo. */
	@keyframes logoGlow {
		0%,
		100% {
			text-shadow:
				0 0 8px #fbc21b,
				/* Small glow at start/end. */ 0 0 20px #fbc21b99; /* Fainter outer glow. */
		}
		50% {
			text-shadow:
				0 0 14px #fbc21b,
				/* Stronger glow at midpoint. */ 0 0 32px #fbc21b; /* Brighter outer glow. */
		}
	}

	/* Apply the glowing animation to the logo. */
	.animate-logoGlow {
		animation: logoGlow 2.4s ease-in-out infinite; /* Smooth infinite animation. */
	}
</style>
