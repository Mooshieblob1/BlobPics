// src/lib/appwrite.ts
import { Client, Databases, Storage, ID } from 'appwrite';

const client = new Client();
client
	.setEndpoint('https://syd.cloud.appwrite.io/v1') // or your self-hosted endpoint
	.setProject('682b826b003d9cba9018'); // Replace with your actual Project ID

export const databases = new Databases(client);
export const storage = new Storage(client);
export const IDHelper = ID;
