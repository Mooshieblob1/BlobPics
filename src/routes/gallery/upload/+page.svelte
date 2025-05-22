<!-- src/routes/gallery/upload/+page.svelte -->
<script lang="ts">
	let file: File | null = null;
	let prompt = '';
	let uploading = false;

	async function upload() {
		if (!file) return alert('Select a file first');
		const imageId = crypto.randomUUID(); // or use file.name if you want

		const metadata = {
			imageId,
			prompt,
			tags: [] // leave empty for now, tagging can happen later
		};

		const formData = new FormData();
		formData.append('file', file);
		formData.append('metadata', JSON.stringify(metadata));

		uploading = true;
		const res = await fetch('https://blobpics.tech/', {
			method: 'POST',
			body: formData
		});
		uploading = false;

		if (res.ok) {
			alert(`Upload complete: ${imageId}`);
			file = null;
			prompt = '';
		} else {
			alert('Upload failed: ' + (await res.text()));
		}
	}
</script>

<h1 class="mb-4 text-2xl text-yellow-400">Upload Image</h1>

<form
	class="space-y-4"
	onsubmit={(e) => {
		e.preventDefault();
		upload();
	}}
>
	<input
		type="file"
		accept="image/*"
		onchange={(e) => {
			const target = e.target as HTMLInputElement;
			file = target.files?.[0] ?? null;
		}}
	/>
	<input
		type="text"
		placeholder="Prompt / Description"
		bind:value={prompt}
		class="w-full rounded bg-zinc-800 px-3 py-2 text-white"
	/>
	<button
		class="rounded bg-yellow-500 px-4 py-2 font-bold text-black disabled:opacity-50"
		type="submit"
		disabled={uploading}
	>
		{uploading ? 'Uploading...' : 'Upload'}
	</button>
</form>
