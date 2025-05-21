# BlobPics

BlobPics is a responsive image gallery application designed to showcase AI-generated artwork or user-uploaded images in a sleek, performant layout that scales across all devices.

## About

BlobPics aims to provide an optimized browsing experience for showcasing images, with a focus on performance, animation, modern UI, and backend integration. It is built with SvelteKit, Tailwind CSS v4, Appwrite, and Motion One.

## Features

### ✅ Completed

- Responsive fullscreen image grid layout
- Preview image thumbnails (via `.webp`) for fast initial load
- Diagonally-skewed animated background grid (like FluffyHugs NFT gallery)
- Full modal system with:
  - Zoom-to-center animation using Motion One
  - Navigation via swipe and arrow buttons
  - Slide transitions with `transitionDirection` support
  - Low-res to high-res image transition
- Appwrite backend integration:
  - Uses Appwrite SDK for image storage and metadata
  - Cloudflare Worker scans buckets, creates `.webp` previews with Sharp
  - Worker syncs and inserts documents into Appwrite Database
- Manual and automated file syncing for new uploads
- Hover effect text overlays
- Background fading overlay effect
- Custom chatbot UI using Gemini API
- Custom favicon and OpenGraph/Twitter preview images
- Metatag testing support (`?test` param or Discord cache refresh)
- Cron-triggered Appwrite Function support (e.g., every minute)
- Environment variables securely loaded with `$env/static/private`
- Image sorting and display shuffle logic
- Search and filtering by tags/prompts
- Image categorization and tagging system
- Image interrogator service hosted on fartcore's server

### 🧪 In Progress

- Image upload UI from frontend (via Appwrite SDK)
- User accounts and login with Supabase/Auth (future)
- Favorite/save image functionality
- View/download counters or analytics

## Technology Stack

- **Frontend**: SvelteKit, Tailwind CSS v4, Motion One, TypeScript
- **Backend**: Appwrite (Functions, Storage, Database), Cloudflare Workers
- **Image Processing**: Sharp (WebP preview generation)
- **Dev Tools**: pnpm, Cloudflare (for deployment)
- **Services**: Image interrogator hosted on fartcore's server

## Development Status

This project is under active development with frequent additions and refactors. All current infrastructure is functioning, and visual/UX polish is ongoing.

## Setup

To run the project locally:

```bash
pnpm install
pnpm dev
```

Ensure `.env` contains required private keys for Appwrite.

## Customization

### Image Scrolling Speed

The homepage features a film-roll effect with scrolling image columns. You can customize the scrolling speed:

- **Location**: In `/src/routes/+page.svelte` inside the column generation loop
- **Current Setting**:
  ```svelte
  {@const animationDuration = 80 + (colIndex % 5) * 10}
  ```

#### How to adjust:

- **Lower values** = faster scrolling
- **Higher values** = slower scrolling

#### Customization options:

1. **Simple adjustment**: Modify the base duration (80) and variation (10):

   ```svelte
   // Faster scrolling
   {@const animationDuration = 30 + (colIndex % 5) * 5}

   // Slower scrolling
   {@const animationDuration = 120 + (colIndex % 5) * 15}
   ```

2. **Advanced customization**: Add reactive variables to the script section:

   ```svelte
   // Add to script section let baseScrollSpeed = $state(80); // Base animation duration in seconds
   let scrollVariation = $state(10); // Amount of variation between columns // Then in your template
   {@const animationDuration = baseScrollSpeed + (colIndex % 5) * scrollVariation}
   ```

This allows easy speed adjustments from a central location and could be extended with UI controls.

## Feedback

Feedback, bug reports, and suggestions are welcome! Reach out or fork the repo to contribute.
