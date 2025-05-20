import type { ServerLoad } from '@sveltejs/kit';

const projectId = '682b826b003d9cba9018';
const databaseId = '682b89cc0016319fcf30';
const collectionId = '682cf95a00397776afa6';
const bucketId = '682cfa1a0016991596f5';

type WebpDoc = {
	$id: string;
	prompt: string;
	webpImageId: string;
};

export const load: ServerLoad = async () => {
	const apiKey = process.env.APPWRITE_API_KEY;
	if (!apiKey) throw new Error('Missing APPWRITE_API_KEY');

	// Fetch metadata documents
	const res = await fetch(
		`https://syd.cloud.appwrite.io/v1/databases/${databaseId}/collections/${collectionId}/documents`,
		{
			headers: {
				'X-Appwrite-Project': projectId,
				'X-Appwrite-Key': apiKey
			}
		}
	);

	if (!res.ok) {
		const error = await res.text();
		console.error('❌ Failed to fetch documents:', error);
		throw new Error('Appwrite document fetch failed');
	}

	const data = await res.json();
	const docs = data.documents as WebpDoc[];

	const gallery = docs.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		imageUrl: `https://syd.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${doc.webpImageId}/preview?project=${projectId}`
	}));

	return { gallery };
};
