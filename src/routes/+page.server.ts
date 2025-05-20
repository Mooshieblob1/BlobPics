import { Client, Databases, Storage } from 'appwrite';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	const client = new Client()
		.setEndpoint('https://syd.cloud.appwrite.io/v1')
		.setProject('682b826b003d9cba9018')
		.setKey(process.env.APPWRITE_API_KEY); // API key must have read access to DB & Storage

	const databases = new Databases(client);
	const storage = new Storage(client);

	const databaseId = '682b89cc0016319fcf30';
	const collectionId = '682cf95a00397776afa6'; // WebP metadata
	const bucketId = '682cfa1a0016991596f5'; // WebP bucket

	const images = await databases.listDocuments(databaseId, collectionId);

	const mapped = images.documents.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		imageUrl: storage.getFilePreview(bucketId, doc.webpImageId)
	}));

	return {
		gallery: mapped
	};
};
