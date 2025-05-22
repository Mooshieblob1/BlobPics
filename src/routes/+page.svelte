<script lang="ts">
	let {
		data
	}: {
		data: { gallery: { id: string; imageUrl: string; prompt: string }[] };
	} = $props();

	function shuffleArray<T>(array: T[]): T[] {
		if (!array || array.length === 0) return [];
		return array
			.map((item) => ({ item, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ item }) => item);
	}

	let screenWidth = $state(0);
	const imagesPerColumn = 10;

	let numColumns = $derived.by(() => {
		if (screenWidth === 0) return 2;
		if (screenWidth < 640) return 2;
		if (screenWidth < 768) return 3;
		if (screenWidth < 1024) return 4;
		if (screenWidth < 1280) return 6;
		if (screenWidth < 1536) return 7;
		return 8;
	});

	let columnWidth = $derived(screenWidth > 0 && numColumns > 0 ? screenWidth / numColumns : 0);
	let imageHeight = $derived(columnWidth * 1.5);

	let columnImages = $derived.by(() => {
		if (!data?.gallery || numColumns <= 0 || data.gallery.length === 0) return [];
		return Array(numColumns)
			.fill(null)
			.map(() => shuffleArray([...data.gallery]).slice(0, imagesPerColumn));
	});

	const currentYear = new Date().getFullYear();

	function getTransformedImageUrl(id: string) {
		const width = screenWidth >= 1536 ? 1280 : 480;
		return `https://blobpics.tech/cdn-cgi/image/width=${width},f=webp/images/${id}`;
	}
</script>

<div class="relative h-screen w-screen overflow-hidden bg-black" bind:clientWidth={screenWidth}>
	{#if screenWidth > 0 && imageHeight > 0}
		<div
			class="absolute inset-0 grid gap-[2px]"
			style={`grid-template-columns: repeat(${numColumns}, 1fr);`}
		>
			{#each columnImages as imagesForThisColumn, colIndex (colIndex)}
				{@const animationDuration = 80 + (colIndex % 5) * 10}
				{@const direction = colIndex % 2 === 0 ? 'down' : 'up'}

				<div class="film-column overflow-hidden">
					<div
						class={`film-strip film-roll-${direction}`}
						style={`animation-duration: ${animationDuration}s;`}
					>
						{#each imagesForThisColumn as image (image.id)}
							<div style={`height: ${imageHeight}px; width: 100%;`}>
								<img
									src={getTransformedImageUrl(image.id)}
									alt={image.prompt}
									draggable={false}
									loading="lazy"
									class="h-full w-full object-cover blur-md brightness-[35%] filter transition duration-700 ease-in-out"
									onload={(e) => (e.target as HTMLImageElement).classList.remove('blur-md')}
								/>
							</div>
						{/each}

						{#each imagesForThisColumn as image (`${image.id}-duplicate`)}
							<div style={`height: ${imageHeight}px; width: 100%;`}>
								<img
									src={getTransformedImageUrl(image.id)}
									alt={image.prompt}
									draggable={false}
									loading="lazy"
									class="h-full w-full object-cover blur-md brightness-[35%] filter transition duration-700 ease-in-out"
									onload={(e) => (e.target as HTMLImageElement).classList.remove('blur-md')}
								/>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<div class="pointer-events-none absolute inset-0 z-10 bg-black/60"></div>

	<p
		class="absolute bottom-2 left-1/2 z-[15] -translate-x-1/2 transform rounded bg-black/50 px-3 py-1 text-[10px] leading-tight whitespace-nowrap text-gray-300 shadow-md sm:text-xs"
	>
		© {currentYear} BlobPics. All rights reserved.
	</p>

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
	.film-column {
		position: relative;
		height: 100%;
	}

	.film-strip {
		position: absolute;
		width: 100%;
	}

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
			transform: translateY(-50%);
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
