// src/routes/gallery/+page.server.ts
import type { ServerLoad } from '@sveltejs/kit';
import { createAppwrite } from '$lib/appwrite';

type WebpDoc = {
	$id: string;
	prompt: string;
	webpImageId: string;
	originalImageId: string;
};

const dbId = '682b89cc0016319fcf30';
const collectionId = '682cf95a00397776afa6';
const webpBucketId = '682cfa1a0016991596f5';
const originalBucketId = '682b8a3a001fb3d3e9f2';

export const load: ServerLoad = async () => {
	const { databases } = createAppwrite();

	const res = await databases.listDocuments(dbId, collectionId);
	const docs = res.documents as WebpDoc[];

	const gallery = docs.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		previewImageId: doc.webpImageId,
		originalImageId: doc.originalImageId
	}));

	return { gallery };
};
