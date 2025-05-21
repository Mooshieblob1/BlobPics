<script lang="ts">
	import { onMount } from 'svelte'; // Retained for potential future use, though not strictly needed with bind:clientWidth

	// Props coming from +page.server.ts
	let {
		data
	}: {
		data: { gallery: { id: string; imageUrl: string; prompt: string }[] };
	} = $props();

	// Function to shuffle the gallery array randomly.
	function shuffleArray<T>(array: T[]): T[] {
		if (!array || array.length === 0) return [];
		return array
			.map((item) => ({ item, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ item }) => item);
	}

	// Screen width, bound to the main container. Initialized with $state for Svelte 5.
	let screenWidth = $state(0);

	// Number of images per column for the film roll effect
	const imagesPerColumn = 10;

	// Reactive calculation for number of columns based on screen width
	// These breakpoints match common TailwindCSS breakpoints.
	let numColumns = $derived.by(() => {
		if (screenWidth === 0) return 2; // Default before clientWidth is bound or for SSR
		if (screenWidth < 640) return 2; // xs to sm
		if (screenWidth < 768) return 3; // sm to md
		if (screenWidth < 1024) return 4; // md to lg
		if (screenWidth < 1280) return 6; // lg to xl
		if (screenWidth < 1536) return 7; // xl to 2xl
		return 8; // 2xl and larger
	});

	// Reactive calculation for column width
	let columnWidth = $derived(screenWidth > 0 && numColumns > 0 ? screenWidth / numColumns : 0);

	// Reactive calculation for image height to maintain 2:3 aspect ratio (width:height)
	// Image Height = Column Width * (3/2)
	let imageHeight = $derived(columnWidth * 1.5);

	// Create arrays of images for each column, reactive to numColumns and data.gallery
	let columnImages = $derived.by(() => {
		if (!data?.gallery || numColumns <= 0 || data.gallery.length === 0) return [];
		return Array(numColumns)
			.fill(null)
			.map(() => {
				// Create a different sequence of images for each column
				return shuffleArray([...data.gallery]).slice(0, imagesPerColumn);
			});
	});

	const currentYear = new Date().getFullYear();
</script>

<!-- === FULL-SCREEN GRID === -->
<div class="relative h-screen w-screen overflow-hidden bg-black" bind:clientWidth={screenWidth}>
	<!-- Grid container for displaying image columns -->
	{#if screenWidth > 0 && imageHeight > 0}
		<!-- Ensure dimensions are calculated before rendering grid -->
		<div
			class="absolute inset-0 grid gap-[2px]"
			style={`grid-template-columns: repeat(${numColumns}, 1fr);`}
		>
			<!-- Create columns of scrolling images -->
			{#each columnImages as imagesForThisColumn, colIndex (colIndex)}
				{@const animationDuration = 80 + (colIndex % 5) * 10}
				{@const direction = colIndex % 2 === 0 ? 'down' : 'up'}

				<div class="film-column overflow-hidden">
					<div
						class={`film-strip film-roll-${direction}`}
						style={`animation-duration: ${animationDuration}s;`}
					>
						<!-- Original set of images -->
						{#each imagesForThisColumn as image (image.id)}
							<div style={`height: ${imageHeight}px; width: 100%;`}>
								<img
									src={image.imageUrl}
									alt={image.prompt}
									draggable={false}
									class="h-full w-full object-cover brightness-[35%] filter"
								/>
							</div>
						{/each}

						<!-- Duplicate the same images for seamless loop -->
						{#each imagesForThisColumn as image (`${image.id}-duplicate`)}
							<div style={`height: ${imageHeight}px; width: 100%;`}>
								<img
									src={image.imageUrl}
									alt={image.prompt}
									draggable={false}
									class="h-full w-full object-cover brightness-[35%] filter"
								/>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- === FULL PAGE DARK OVERLAY === -->
	<div class="pointer-events-none absolute inset-0 z-10 bg-black/60"></div>

	<!-- === COPYRIGHT TEXT === -->
	<p
		class="absolute bottom-2 left-1/2 z-[15] -translate-x-1/2 transform whitespace-nowrap rounded bg-black/50 px-3 py-1 text-[10px] leading-tight text-gray-300 shadow-md sm:text-xs"
	>
		© {currentYear} BlobPics. All rights reserved.
	</p>

	<!-- === CENTRE LOGO === -->
	<div class="relative z-20 flex h-full w-full flex-col items-center justify-center">
		<h1
			class="logo mb-6 text-5xl font-bold text-yellow-400 drop-shadow-[0_0_8px_#fbc21b] select-none sm:text-6xl md:text-7xl 2xl:text-8xl"
		>
			{#each 'BlobPics'.split('') as letter, index}
				<span class="animate-pop inline-block" style="animation-delay: {index * 0.2}s"
					>{letter}</span
				>
			{/each}
		</h1>

		<a
			href="/gallery"
			class="rounded-lg bg-yellow-400 px-6 py-3 font-bold text-black shadow-lg transition-all duration-300 hover:bg-yellow-500 2xl:px-8 2xl:py-4 2xl:text-xl"
		>
			View Gallery
		</a>
	</div>
</div>

<style>
	/* Film column container */
	.film-column {
		position: relative;
		height: 100%;
	}

	/* Film strip containing all images */
	.film-strip {
		position: absolute;
		width: 100%;
	}

	/* Film roll animations */
	.film-roll-down,
	.film-roll-up {
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	.film-roll-down {
		animation-name: filmRollDown;
	}

	.film-roll-up {
		animation-name: filmRollUp;
	}

	@keyframes filmRollDown {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-50%); /* Move up by half the height of the film-strip */
		}
	}

	@keyframes filmRollUp {
		0% {
			transform: translateY(-50%);
		}
		100% {
			transform: translateY(0);
		}
	}

	/* Popping animation for each letter */
	@keyframes pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.3);
		}
		100% {
			transform: scale(1);
		}
	}

	.animate-pop {
		animation: pop 1.2s ease-in-out infinite;
		display: inline-block;
	}
</style>
