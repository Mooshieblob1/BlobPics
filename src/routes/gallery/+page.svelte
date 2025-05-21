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
<div
	class="fixed top-0 left-0 z-50 w-full bg-black/70 px-4 py-3 text-center backdrop-blur-sm md:py-4"
>
	<a href="/" class="inline-block">
		<h1
			class="hover:shadow-glow text-2xl font-bold text-yellow-500 transition duration-300 ease-in-out hover:text-yellow-400 md:text-3xl"
		>
			Blobpics
		</h1>
	</a>
</div>

<!-- Add padding to push content below the fixed header -->
<div class="pt-16 md:pt-20">
	<!-- Gallery Grid -->
	<div
		class="columns-1 gap-4 px-3 py-6 sm:columns-2 sm:gap-6 sm:px-6 sm:py-8 md:gap-8 md:px-8 md:py-10 lg:columns-3"
	>
		{#each data.gallery as item}
			<a
				href={fullUrl(item.originalImageId)}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative mb-4 block break-inside-avoid overflow-hidden rounded-lg sm:mb-6 md:mb-10"
			>
				<img
					src={previewUrl(item.previewImageId)}
					alt={item.prompt}
					loading="lazy"
					class="h-full w-full object-cover transition duration-300 ease-in-out group-hover:brightness-90"
				/>

				<div
					class="absolute bottom-0 left-0 w-full bg-black/60 px-2 py-1.5 text-xs text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 md:px-3 md:py-2 md:text-sm"
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
