import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ fetch }) => {
	try {
		const endpoint = import.meta.env.DEV ? 'https://blobpics.tech/api/list' : '/api/list';

		const response = await fetch(endpoint);
		if (!response.ok) {
			console.error('Failed to fetch gallery:', response.status, await response.text());
			return { gallery: [] };
		}

		const rawItems: { imageId: string; prompt: string }[] = await response.json();

		const gallery = await Promise.all(
			rawItems.map(async (item) => {
				let tags: string[] = [];
				const groupedTags: { general: [string, number][] } = { general: [] };

				try {
					const tagRes = await fetch(
						`https://blobpics.tech/images/tags/complete/${item.imageId}.json`
					);
					if (tagRes.ok) {
						const tagJson = await tagRes.json();
						tags = tagJson.tags ?? [];
						groupedTags.general = tagJson.groupedTags?.general ?? [];
					}
				} catch {
					console.warn(`No tags for ${item.imageId}`);
				}

				return {
					id: item.imageId,
					prompt: item.prompt,
					tags,
					groupedTags,
					previewImageId: item.imageId,
					originalImageId: item.imageId
				};
			})
		);

		return { gallery };
	} catch (err) {
		console.error('Error loading gallery:', err);
		return { gallery: [] };
	}
};
