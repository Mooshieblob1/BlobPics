<script lang="ts">
	// Define the type for the data prop received from the parent component
	// This contains an array of gallery items with their IDs, prompts, and image references
	export let data: {
		gallery: {
			id: string;
			prompt: string; // The text prompt used to generate the image
			previewImageId: string; // ID for the smaller preview image
			originalImageId: string; // ID for the full-size original image
		}[];
	};

	// Helper function to generate the URL for preview thumbnail images
	// Takes an image ID and returns the complete Appwrite storage URL with preview parameters
	const previewUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682cfa1a0016991596f5/files/${id}/preview?project=682b826b003d9cba9018`;

	// Helper function to generate the URL for full-size original images
	// Takes an image ID and returns the complete Appwrite storage URL with view parameters
	const fullUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682b8a3a001fb3d3e9f2/files/${id}/view?project=682b826b003d9cba9018`;
</script>

<!-- Fixed header with translucent background -->
<!-- This header stays fixed at the top of the viewport while scrolling -->
<div
	class="fixed top-0 left-0 z-50 w-full bg-black/70 px-4 py-3 text-center backdrop-blur-sm md:py-4"
>
	<!-- Navigation link back to home page -->
	<a href="/" class="inline-block">
		<h1
			class="hover:shadow-glow text-2xl font-bold text-yellow-500 transition duration-300 ease-in-out hover:text-yellow-400 md:text-3xl"
		>
			Blobpics
		</h1>
	</a>
</div>

<!-- Spacer div with padding to push content below the fixed header -->
<div class="pt-16 md:pt-20">
	<!-- Gallery Grid - Uses CSS columns for masonry-style layout -->
	<!-- Responsive design with different column counts based on screen size -->
	<div
		class="columns-1 gap-4 px-3 py-6 sm:columns-2 sm:gap-6 sm:px-6 sm:py-8 md:gap-8 md:px-8 md:py-10 lg:columns-4 2xl:mx-auto 2xl:max-w-screen-2xl 2xl:columns-5"
	>
		<!-- Iterate through each gallery item to create image cards -->
		{#each data.gallery as item}
			<!-- Wrapping link that opens the full-size image in a new tab -->
			<!-- Using 'group' class for hover effects that target child elements -->
			<a
				href={fullUrl(item.originalImageId)}
				target="_blank"
				rel="noopener noreferrer"
				class="group relative mb-4 block break-inside-avoid overflow-hidden rounded-lg sm:mb-6 md:mb-10"
			>
				<!-- Preview image with lazy loading for performance -->
				<!-- Slight darkening effect on hover via brightness-90 -->
				<img
					src={previewUrl(item.previewImageId)}
					alt={item.prompt}
					loading="lazy"
					class="w-30vh h-full object-cover transition duration-300 ease-in-out group-hover:brightness-90"
				/>

				<!-- Caption overlay that appears on hover -->
				<!-- Uses opacity transition to fade in when parent group is hovered -->
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
	/* Custom hover effect for the site title */
	/* Creates a yellow glow effect with multiple layers of text shadow */
	/* Shadow intensity decreases with distance for a realistic glow effect */
	.hover\:shadow-glow:hover {
		text-shadow:
			0 0 10px rgba(250, 204, 21, 0.7),
			0 0 20px rgba(250, 204, 21, 0.5),
			0 0 30px rgba(250, 204, 21, 0.3);
	}
</style>
