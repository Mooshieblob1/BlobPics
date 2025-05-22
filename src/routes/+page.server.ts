// src/routes/+page.server.ts
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		const res = await fetch('/api/list');

		if (!res.ok) {
			console.error(`Failed to fetch gallery: ${res.status}`);
			return { gallery: [] };
		}

		const gallery: {
			id: string;
			prompt: string;
			imageUrl: string;
		}[] = await res.json();

		return { gallery };
	} catch (error) {
		console.error('Error fetching gallery:', error);
		return { gallery: [] };
	}
};
