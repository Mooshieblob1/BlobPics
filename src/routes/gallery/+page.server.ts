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
const collectionId = '682cf95a00397776afa6'; // your gallery collection
const tagCollectionId = '682d7b240022ba63cd02'; // your tag document collection

export const load: ServerLoad = async () => {
	const { databases } = createAppwrite();

	// Fetch gallery images
	const galleryRes = await databases.listDocuments(dbId, collectionId);
	const images: WebpDoc[] = galleryRes.documents as WebpDoc[];

	// Fetch tags
	const tagRes = await databases.listDocuments(dbId, tagCollectionId);
	const tagMap = new Map(tagRes.documents.map((doc: any) => [doc.imageId, doc.tags]));

	const gallery = images.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		previewImageId: doc.webpImageId,
		originalImageId: doc.originalImageId,
		tags: tagMap.get(doc.webpImageId) ?? []
	}));

	return { gallery };
};
