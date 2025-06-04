// src/routes/gallery/+page.server.ts
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		// Always fetch from the production API since that's where CF serves the images
		const endpoint = 'https://worker-blob.gpu.garden/api/list';

		const response = await fetch(endpoint);
		if (!response.ok) {
			console.error(`Failed to fetch gallery: ${response.status}`);
			return { gallery: [] };
		}

		// The API now returns objects shaped like:
		// { id, prompt, previewImageId, originalImageId, tags, groupedTags }
		const rawItems: Array<{
			id: string;
			prompt: string;
			previewImageId?: string;
			originalImageId?: string;
			tags?: string[];
			groupedTags?: Record<string, unknown>;
		}> = await response.json();

		// Map directly into the shape your +page.svelte wants
		const gallery = rawItems.map((item) => ({
			id: item.id,
			prompt: item.prompt,
			previewImageId: item.previewImageId ?? item.id,
			originalImageId: item.originalImageId ?? item.id,
			tags: Array.isArray(item.tags) ? item.tags : [],
			groupedTags: item.groupedTags ? item.groupedTags : {}
		}));

		return { gallery };
	} catch (error) {
		console.error('Error fetching gallery:', error);
		return { gallery: [] };
	}
};
