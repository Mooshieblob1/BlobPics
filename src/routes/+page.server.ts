// Import the Appwrite API key from SvelteKit's private environment variables
// This key is used for authentication with Appwrite services
import { APPWRITE_API_KEY } from '$env/static/private';
// Alternative way to import environment variables (commented out)
// import { env } from '$env/dynamic/private';

// Import the ServerLoad type from SvelteKit to properly type our load function
import type { ServerLoad } from '@sveltejs/kit';

// Appwrite configuration constants
// Project ID uniquely identifies your Appwrite project
const projectId = '682b826b003d9cba9018';
// Database ID identifies which database to use in your Appwrite project
const databaseId = '682b89cc0016319fcf30';
// Collection ID identifies which collection (table) to query within the database
const collectionId = '682cf95a00397776afa6';
// Bucket ID identifies the storage bucket where images are stored
const bucketId = '682cfa1a0016991596f5';

// TypeScript interface defining the structure of documents returned from Appwrite
type WebpDoc = {
	$id: string; // Unique document identifier in Appwrite
	prompt: string; // Text prompt associated with the image
	webpImageId: string; // ID reference to the image file in storage
};

// SvelteKit server-side load function that executes when the page is requested
// This function fetches data before the page is rendered and passes it to the frontend
export const load: ServerLoad = async () => {
	// Retrieve API key from environment variables
	const apiKey = APPWRITE_API_KEY;
	// Verify API key exists, otherwise throw an error to prevent proceeding
	if (!apiKey) throw new Error('Missing APPWRITE_API_KEY');

	// Fetch all documents from the specified Appwrite collection
	// Using Appwrite's REST API endpoint for document retrieval
	const res = await fetch(
		`https://syd.cloud.appwrite.io/v1/databases/${databaseId}/collections/${collectionId}/documents`,
		{
			headers: {
				// Required authentication headers for Appwrite API
				'X-Appwrite-Project': projectId,
				'X-Appwrite-Key': apiKey
			}
		}
	);

	// Check if the API request was successful
	if (!res.ok) {
		// If request failed, get the error message
		const error = await res.text();
		// Log the error to server console for debugging
		console.error('❌ Failed to fetch documents:', error);
		// Throw an error that will be handled by SvelteKit's error page
		throw new Error('Appwrite document fetch failed');
	}

	// Parse the JSON response from Appwrite
	const data = await res.json();
	// Extract the documents array and cast to our WebpDoc type
	const docs = data.documents as WebpDoc[];

	// Transform raw Appwrite documents into a format suitable for the frontend
	const gallery = docs.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		// Construct a full URL to the image preview using Appwrite's storage API
		imageUrl: `https://syd.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${doc.webpImageId}/preview?project=${projectId}`
	}));

	// Return the gallery data to be accessible in the +page.svelte component
	return { gallery };
};
