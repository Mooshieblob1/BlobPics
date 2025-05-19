// src/routes/gallery/+page.server.ts
import { databases, storage } from '$lib/appwrite';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	const collectionId = '682b8a1a003b15611710';
	const databaseId = '682b89cc0016319fcf30';
	const bucketId = '682b8a3a001fb3d3e9f2';

	const images = await databases.listDocuments(databaseId, collectionId, [
		// You can add ordering or limits here
	]);

	const mapped = images.documents.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		imageUrl: storage.getFilePreview(bucketId, doc.imageId) // creates a preview URL
	}));

	return {
		gallery: mapped
	};
};
