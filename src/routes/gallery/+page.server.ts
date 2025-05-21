// src/routes/gallery/+page.server.ts

// Import the ServerLoad type from SvelteKit for type checking of the load function
import type { ServerLoad } from '@sveltejs/kit';
// Import custom function to initialize Appwrite client with proper configuration
import { createAppwrite } from '$lib/appwrite';

/**
 * TypeScript interface representing the structure of a document in the Appwrite database
 * Each document contains metadata about an image:
 * - $id: Unique identifier for the document
 * - prompt: Text prompt that was used to generate or describe the image
 * - webpImageId: ID reference to the optimized WebP version of the image in storage
 * - originalImageId: ID reference to the original image file in storage
 */
type WebpDoc = {
	$id: string;
	prompt: string;
	webpImageId: string;
	originalImageId: string;
};

// Appwrite database identifier
const dbId = '682b89cc0016319fcf30';
// Collection identifier within the database
const collectionId = '682cf95a00397776afa6';
// Storage bucket identifier for WebP optimized images
const webpBucketId = '682cfa1a0016991596f5';
// Storage bucket identifier for original images
const originalBucketId = '682b8a3a001fb3d3e9f2';

/**
 * SvelteKit server load function that executes when the gallery page is requested
 * Retrieves image data from Appwrite and prepares it for the frontend
 */
export const load: ServerLoad = async () => {
	// Initialize the Appwrite client, specifically accessing the databases service
	const { databases } = createAppwrite();

	// Fetch all documents from the specified collection
	const res = await databases.listDocuments(dbId, collectionId);
	// Cast the retrieved documents to our WebpDoc type for type safety
	const docs = res.documents as unknown as WebpDoc[];

	// Transform database documents into a frontend-friendly format
	// This removes unnecessary database metadata and renames fields for clarity
	const gallery = docs.map((doc) => ({
		id: doc.$id,
		prompt: doc.prompt,
		previewImageId: doc.webpImageId,
		originalImageId: doc.originalImageId
	}));

	// Return the gallery data which will be available to the page component
	return { gallery };
};
