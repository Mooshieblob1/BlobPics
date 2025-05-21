// src/lib/appwrite.ts
import { Client, Databases, Storage, ID } from 'node-appwrite'; // Import from the Node.js SDK
import { APPWRITE_API_KEY } from '$env/static/private';

const endpoint = 'https://syd.cloud.appwrite.io/v1';
const projectId = '682b826b003d9cba9018';

function createAppwriteInternal() {
	if (!APPWRITE_API_KEY) throw new Error('Missing APPWRITE_API_KEY');

	const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(APPWRITE_API_KEY); // ✅ works only in node SDK

	const databases = new Databases(client);
	const storage = new Storage(client);

	return {
		client,
		databases,
		storage,
		IDHelper: ID
	};
}

export { createAppwriteInternal as createAppwrite };
