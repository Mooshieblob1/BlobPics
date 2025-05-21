import { createAppwrite } from '$lib/appwrite'; // ✅ Use your helper
import type { ServerLoad } from '@sveltejs/kit';
import { Query } from 'node-appwrite';

export const load: ServerLoad = async () => {
	const { databases, storage } = createAppwrite(); // ✅ Get services from factory

	const collectionId = '682b8a1a003b15611710';
	const databaseId = '682b89cc0016319fcf30';
	const bucketId = '682b8a3a001fb3d3e9f2';

	// Fetch up to 100 documents instead of default 25
	const images = await databases.listDocuments(databaseId, collectionId, [Query.limit(100)]);

	const mapped = images.documents.map((doc: any) => ({
		id: doc.$id,
		prompt: doc.prompt,
		imageUrl: storage.getFilePreview(bucketId, doc.imageId)
	}));

	return {
		gallery: mapped
	};
};
