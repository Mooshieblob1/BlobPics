<!-- src/routes/+layout.svelte -->
<script>
	import '../app.css';
</script>

<main class="min-h-screen bg-neutral-950 font-sans text-white">
	<header class="p-4 text-center text-2xl font-bold text-yellow-400">blobpics.tech</header>

	<slot />

	<footer class="mt-10 p-4 text-center text-xs text-neutral-400">
		© {new Date().getFullYear()} Blobpics — AI image gallery
	</footer>
</main>
