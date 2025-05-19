<!-- src/routes/+page.svelte -->
<script>
	import { goto } from '$app/navigation';
</script>

<section class="flex min-h-[80vh] flex-col items-center justify-center gap-6 px-4 text-center">
	<h1 class="text-4xl font-bold text-yellow-400 sm:text-6xl">blobpics.tech</h1>
	<p class="max-w-xl text-neutral-300">
		Showcase your best AI-generated creations in a fast, beautiful, responsive gallery.
	</p>
	<button
		on:click={() => goto('/gallery')}
		class="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
	>
		View Gallery
	</button>
</section>
