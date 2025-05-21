<script lang="ts">
	export let data: {
		gallery: {
			id: string;
			prompt: string;
			previewImageId: string;
			originalImageId: string;
		}[];
	};

	const previewUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682cfa1a0016991596f5/files/${id}/preview?project=682b826b003d9cba9018`;

	const fullUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682b8a3a001fb3d3e9f2/files/${id}/view?project=682b826b003d9cba9018`;
</script>

<!-- Fixed header with translucent background -->
<div class="fixed top-0 left-0 z-50 w-full bg-black/70 py-4 text-center backdrop-blur-sm">
	<a href="/" class="inline-block">
		<h1
			class="hover:shadow-glow text-3xl font-bold text-yellow-500 transition duration-300 ease-in-out hover:text-yellow-400"
		>
			Blobpics
		</h1>
	</a>
</div>

<!-- Add padding to push content below the fixed header -->
<div class="pt-20">
	<!-- Gallery Grid -->
	<div class="columns-1 gap-8 px-50 py-10 sm:columns-2 lg:columns-3">
		{#each data.gallery as item}
			<a
				href={fullUrl(item.originalImageId)}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative mb-10 block break-inside-avoid overflow-hidden rounded-lg"
			>
				<img
					src={previewUrl(item.previewImageId)}
					alt={item.prompt}
					loading="lazy"
					class="h-full w-full object-cover transition duration-300 ease-in-out group-hover:brightness-90"
				/>

				<div
					class="absolute bottom-0 left-0 w-full bg-black/60 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
				>
					{item.prompt}
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.hover\:shadow-glow:hover {
		text-shadow:
			0 0 10px rgba(250, 204, 21, 0.7),
			0 0 20px rgba(250, 204, 21, 0.5),
			0 0 30px rgba(250, 204, 21, 0.3);
	}
</style>
