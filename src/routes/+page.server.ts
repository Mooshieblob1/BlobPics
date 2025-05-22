import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		const endpoint = import.meta.env.DEV ? 'https://blobpics.tech/api/list' : '/api/list';

		const response = await fetch(endpoint);
		if (!response.ok) {
			console.error(`Failed to fetch gallery: ${response.status}`);
			return { gallery: [] };
		}

		const rawItems: {
			imageId: string;
			prompt: string;
			tags: string[];
		}[] = await response.json();

		// Reshape to match the home page's expectation
		const gallery = rawItems.map((item) => ({
			id: item.imageId,
			imageUrl: item.imageId, // we'll build the full URL in the component
			prompt: item.prompt
		}));

		return { gallery };
	} catch (error) {
		console.error('Error fetching gallery:', error);
		return { gallery: [] };
	}
};
