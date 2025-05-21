<script lang="ts">
	// Props coming from +page.server.ts
	let {
		data
	}: {
		data: { gallery: { id: string; imageUrl: string; prompt: string }[] };
	} = $props();

	// Function to shuffle the gallery array randomly.
	function shuffleArray<T>(array: T[]): T[] {
		return array
			.map((item) => ({ item, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ item }) => item);
	}

	// Shuffle the gallery array and store it in `shuffledGallery`.
	const shuffledGallery = shuffleArray(data.gallery);

	// Maximum number of columns at largest breakpoint
	const maxColumns = 8;
	
	// Number of images per column for the film roll effect
	const imagesPerColumn = 10;

	// Create arrays of images for each column
	const columnImages = Array(maxColumns).fill(0).map((_, colIndex) => {
		// Create a different sequence of images for each column
		return shuffleArray([...data.gallery]).slice(0, imagesPerColumn);
	});
</script>

<!-- === FULL-SCREEN GRID === -->
<div class="relative h-screen w-screen overflow-hidden bg-black">
	<!-- Grid container for displaying image columns -->
	<div
		class="absolute inset-0 grid grid-cols-2 gap-[2px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
	>
		<!-- Create columns of scrolling images -->
		{#each Array(maxColumns) as _, colIndex}
			{@const animationDuration = 30 + (colIndex % 5) * 5}
			{@const direction = colIndex % 2 === 0 ? 'down' : 'up'}
			
			<div class="film-column overflow-hidden">
				<div 
					class={`film-strip film-roll-${direction}`} 
					style={`animation-duration: ${animationDuration}s;`}
				>
					<!-- Original set of images -->
					{#each columnImages[colIndex] as image}
						<div class="h-[20vh]">
							<img
								src={image.imageUrl}
								alt={image.prompt}
								draggable={false}
								class="h-full w-full object-cover brightness-[35%] filter"
							/>
						</div>
					{/each}
					
					<!-- Duplicate the same images for seamless loop -->
					{#each columnImages[colIndex] as image}
						<div class="h-[20vh]">
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

	<!-- === FULL PAGE DARK OVERLAY === -->
	<div class="pointer-events-none absolute inset-0 z-10 bg-black/60"></div>

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
		overflow: hidden;
		height: 100%;
	}

	/* Film strip containing all images */
	.film-strip {
		position: absolute;
		width: 100%;
	}

	/* Film roll animations */
	.film-roll-down, .film-roll-up {
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
			transform: translateY(-50%); /* Move up by half the height */
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
