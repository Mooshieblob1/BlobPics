<script lang="ts">
	// This defines the expected data structure that will be passed to this component
	// The 'export let' syntax is how Svelte defines props
	export let data: {
		gallery: {
			id: string; // Unique identifier for the gallery item
			prompt: string; // Text prompt used to generate the image
			previewImageId: string; // ID of the preview-sized image
			originalImageId: string; // ID of the original/full-sized image
		}[];
	};

	// Function to create the URL for preview images
	// Takes an image ID and returns the full URL for the preview version
	const previewUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682cfa1a0016991596f5/files/${id}/preview?project=682b826b003d9cba9018`;

	// Function to create the URL for full-sized original images
	// Takes an image ID and returns the full URL for viewing the original
	const fullUrl = (id: string) =>
		`https://syd.cloud.appwrite.io/v1/storage/buckets/682b8a3a001fb3d3e9f2/files/${id}/view?project=682b826b003d9cba9018`;
</script>

<!-- Blobpics Logo Header: Displays the site logo as a link to the homepage -->
<div class="py-6 text-center">
	<!-- The 'href="/"' makes this link point to the root/home page -->
	<a href="/" class="inline-block">
		<h1
			class="hover:shadow-glow text-3xl font-bold text-yellow-500 transition duration-300 ease-in-out hover:text-yellow-400"
		>
			Blobpics
		</h1>
	</a>
</div>

<!-- Gallery Grid: Uses CSS columns for a responsive masonry-like layout -->
<!-- The columns-1, sm:columns-2, lg:columns-3 classes make it responsive: 
	 1 column on mobile, 2 on small screens, 3 on large screens -->
<div class="columns-1 gap-8 px-50 py-10 sm:columns-2 lg:columns-3">
	<!-- Svelte's #each directive loops through the gallery array -->
	{#each data.gallery as item}
		<!-- Each gallery item is a link to the full-sized image -->
		<a
			href={fullUrl(item.originalImageId)}
			target="_blank"
			rel="noopener noreferrer"
			class="group relative mb-10 block break-inside-avoid overflow-hidden rounded-lg"
		>
			<!-- The image itself, using the preview-sized version for better loading performance -->
			<!-- 'loading="lazy"' tells the browser to only load images as they come into viewport -->
			<img
				src={previewUrl(item.previewImageId)}
				alt={item.prompt}
				loading="lazy"
				class="h-full w-full object-cover transition duration-300 ease-in-out group-hover:brightness-90"
			/>

			<!-- Bottom hover banner that shows the prompt text when hovering over an image -->
			<!-- The 'group-hover:opacity-100' class makes this div visible only when hovering the parent (which has the 'group' class) -->
			<div
				class="absolute bottom-0 left-0 w-full bg-black/60 px-3 py-2 text-sm text-white opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
			>
				{item.prompt}
			</div>
		</a>
	{/each}
</div>

<style>
	/* Custom CSS to create a glowing text effect when hovering over the logo */
	/* The '\' in hover\:shadow-glow escapes the colon for proper CSS syntax */
	.hover\:shadow-glow:hover {
		text-shadow:
			0 0 10px rgba(250, 204, 21, 0.7),
			0 0 20px rgba(250, 204, 21, 0.5),
			0 0 30px rgba(250, 204, 21, 0.3);
	}
</style>
