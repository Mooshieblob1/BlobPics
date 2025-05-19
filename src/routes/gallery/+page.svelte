<script lang="ts">
	export let data: { gallery: { id: string; prompt: string; imageUrl: string }[] };
</script>

<div class="columns-1 gap-4 px-4 py-8 sm:columns-2 lg:columns-3">
	{#each data.gallery as item}
		<div class="group relative mb-4 break-inside-avoid">
			<img src={item.imageUrl} alt={item.prompt} class="w-full rounded-lg" />
			<div
				class="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 p-2 text-center text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			>
				{item.prompt}
			</div>
		</div>
	{/each}
</div>
