import { databases, storage } from '$lib/appwrite';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	const collectionId = '682cf95a00397776afa6'; // WebP metadata collection
	const databaseId = '682b89cc0016319fcf30';
	const bucketId = '682cfa1a0016991596f5'; // WebP bucket

	const images = await databases.listDocuments(databaseId, collectionId, []);

	const mapped = images.documents.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		imageUrl: storage.getFilePreview(bucketId, doc.webpImageId)
	}));

	return {
		gallery: mapped
	};
};
