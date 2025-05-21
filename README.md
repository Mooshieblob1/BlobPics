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

### 🧪 In Progress

- Image upload UI from frontend (via Appwrite SDK)
- Search and filtering by tags/prompts
- Image categorization and tagging system
- User accounts and login with Supabase/Auth (future)
- Favorite/save image functionality
- View/download counters or analytics

## Technology Stack

- **Frontend**: SvelteKit, Tailwind CSS v4, Motion One, TypeScript
- **Backend**: Appwrite (Functions, Storage, Database), Cloudflare Workers
- **Image Processing**: Sharp (WebP preview generation)
- **Dev Tools**: pnpm, Vercel (for deployment)

## Development Status

This project is under active development with frequent additions and refactors. All current infrastructure is functioning, and visual/UX polish is ongoing.

## Setup

To run the project locally:

```bash
pnpm install
pnpm dev
```

Ensure `.env` contains required private keys for Appwrite.

## Feedback

Feedback, bug reports, and suggestions are welcome! Reach out or fork the repo to contribute.
