<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
</script>

<main class="min-h-screen bg-gray-900 font-sans text-white">
	<slot />

	<footer class="mt-10 p-4 text-center text-xs text-neutral-400">
		© {new Date().getFullYear()} Blobpics — AI image gallery
	</footer>
</main>
