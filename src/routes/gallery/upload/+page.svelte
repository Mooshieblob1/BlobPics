<!-- src/routes/gallery/upload/+page.svelte -->
<script lang="ts">
	let file: File | null = null;
	let prompt = '';
	let uploading = false;

	async function upload() {
		if (!file) return alert('Select a file first');
		const imageId = crypto.randomUUID();

		const metadata = {
			imageId,
			prompt,
			tags: [] // tagging happens later
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
			console.log('Uploaded', imageId);
			alert(`✅ Upload complete: ${imageId}`);
			file = null;
			prompt = '';
			const input = document.getElementById('upload-input') as HTMLInputElement | null;
			if (input) input.value = '';
		} else {
			alert('❌ Upload failed: ' + (await res.text()));
		}
	}
</script>

<div class="mx-auto max-w-xl px-4 py-8">
	<a href="/" class="mb-4 block text-lg font-bold text-yellow-400 hover:underline">← Back to Home</a
	>
	<h1 class="mb-4 text-2xl font-bold text-yellow-400">Upload Image</h1>

	<form
		class="space-y-4"
		onsubmit={(e) => {
			e.preventDefault();
			upload();
		}}
	>
		<input
			id="upload-input"
			type="file"
			accept="image/*"
			class="block w-full text-white"
			onchange={(e) => {
				const target = e.target as HTMLInputElement;
				file = target?.files?.[0] ?? null;
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
</div>
