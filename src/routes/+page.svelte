<script lang="ts">
	/* Props coming from +page.server.ts */
	let {
		data
	}: {
		data: { gallery: { id: string; imageUrl: string; prompt: string }[] };
	} = $props();
</script>

<!-- === FULL-SCREEN GRID === -->
<div class="relative h-screen w-screen overflow-hidden bg-black">
	<div
		class="absolute inset-0 grid grid-cols-2 gap-[2px] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
	>
		{#each data.gallery as item, i}
			<img
				src={item.imageUrl}
				alt={item.prompt}
				draggable={false}
				class={`h-full w-full object-cover brightness-[35%] filter motion-safe:animate-[pan_${
					28 + (i % 6)
				}s_ease-in-out_infinite]`}
			/>
		{/each}
	</div>

	<!-- === SKEWED DARK OVERLAY === -->
	<div class="pointer-events-none absolute inset-0 z-10 overflow-hidden">
		<div
			class="absolute inset-0 bg-black/60"
			style="transform: skewY(-4deg); transform-origin: top left;"
		/>
	</div>

	<!-- === CENTRE LOGO === -->
	<div class="relative z-20 flex h-full w-full items-center justify-center">
		<h1
			class="animate-logoGlow text-5xl font-bold text-yellow-400 drop-shadow-[0_0_8px_#fbc21b] select-none sm:text-6xl"
		>
			BlobPics
		</h1>
	</div>
</div>

<style>
	/* Slow pan keyframe (same for every img; duration staggered via inline Tailwind) */
	@keyframes pan {
		0%,
		100% {
			transform: scale(1.1) translate(0, 0);
		}
		50% {
			transform: scale(1.1) translate(-12px, -12px);
		}
	}

	/* Glowing logo pulse */
	@keyframes logoGlow {
		0%,
		100% {
			text-shadow:
				0 0 8px #fbc21b,
				0 0 20px #fbc21b99;
		}
		50% {
			text-shadow:
				0 0 14px #fbc21b,
				0 0 32px #fbc21b;
		}
	}

	.animate-logoGlow {
		animation: logoGlow 2.4s ease-in-out infinite;
	}
</style>
