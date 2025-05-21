/**
 * Gallery Data Module
 *
 * This file contains the primary gallery data for the BlobPics application.
 * It exports an array of image objects that can be used throughout the application
 * to display images in galleries, slideshows, or individual views.
 */

/**
 * Gallery array containing image objects with their metadata
 *
 * Each object in this array represents a single image with the following properties:
 * - id: A unique identifier for the image
 * - src: The file path to the image resource
 * - prompt: The text prompt that was used to generate or describe the image
 */
export const gallery = [
	{
		id: '1', // Unique identifier for this image
		src: '/images/sample1.webp', // Path to the image file from the public directory
		prompt: 'A dreamy sunset over a neon city' // Description or generation prompt for the image
	},
	{
		id: '2', // Unique identifier for this image
		src: '/images/sample2.webp', // Path to the image file from the public directory
		prompt: 'Surreal cat with galaxies in its fur' // Description or generation prompt for the image
	},
	{
		id: '3', // Unique identifier for this image
		src: '/images/sample3.webp', // Path to the image file from the public directory
		prompt: 'A robot girl with glowing eyes' // Description or generation prompt for the image
	}
	// Add more images to the gallery by following the same object structure
];
