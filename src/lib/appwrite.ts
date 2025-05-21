// src/lib/appwrite.ts

// Import necessary classes from the Appwrite Node.js SDK
// - Client: Creates the connection to Appwrite servers
// - Databases: Provides methods to interact with Appwrite databases
// - Storage: Provides methods to interact with Appwrite storage (for files/images)
// - ID: Helper class for generating unique IDs
import { Client, Databases, Storage, ID } from 'node-appwrite'; // Import from the Node.js SDK

// Import API key from SvelteKit's private environment variables
// This key should never be exposed to the client-side
import { APPWRITE_API_KEY } from '$env/static/private';

// Define the Appwrite API endpoint - this is the base URL for all API requests
const endpoint = 'https://syd.cloud.appwrite.io/v1';

// The unique identifier for this Appwrite project
const projectId = '682b826b003d9cba9018';

/**
 * Creates and configures an Appwrite client with necessary services
 * This function is for server-side use only as it requires API keys
 * @returns Object containing configured Appwrite services
 */
function createAppwriteInternal() {
	// Verify API key exists before proceeding
	if (!APPWRITE_API_KEY) throw new Error('Missing APPWRITE_API_KEY');

	// Initialize the Appwrite client with configuration details
	// setEndpoint: Defines the API endpoint to connect to
	// setProject: Specifies which Appwrite project to use
	// setKey: Authenticates the client using the API key
	const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(APPWRITE_API_KEY);

	// Initialize the Databases service with the configured client
	// This allows interaction with Appwrite databases (querying, creating documents, etc.)
	const databases = new Databases(client);

	// Initialize the Storage service with the configured client
	// This allows handling file uploads, downloads, and management
	const storage = new Storage(client);

	// Return an object with all necessary Appwrite services and utilities
	return {
		client, // The base Appwrite client
		databases, // For database operations
		storage, // For file storage operations
		IDHelper: ID // Helper for generating unique IDs (renamed for clarity)
	};
}

// Export the function with a more generic name for external use
export { createAppwriteInternal as createAppwrite };
