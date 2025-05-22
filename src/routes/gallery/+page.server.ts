import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		// Call your Worker or API endpoint that returns image metadata
		const response = await fetch('/api/list');

		if (!response.ok) {
			console.error('Failed to fetch gallery:', response.status, await response.text());
			return { gallery: [] };
		}

		// Ensure this matches your expected format
		const gallery: {
			id: string;
			prompt: string;
			previewImageId: string;
			originalImageId: string;
			tags: string[];
		}[] = await response.json();

		return { gallery };
	} catch (err) {
		console.error('Error loading gallery:', err);
		return { gallery: [] };
	}
};
