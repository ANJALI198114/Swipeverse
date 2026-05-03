# SwipeVerse 💘 — Unbiased Dating App

A complete, production-ready dating app built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

## Deployment

https://swipeverse-two.vercel.app/


## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom CSS variables
- **State**: React Context API
- **Font**: Outfit (Google Fonts)

## Features

### Pages & Screens
| Route | Description |
|-------|-------------|
| `/` | Landing page with animated logo & floating hearts |
| `/auth` | Login & Sign Up with form validation |
| `/discover` | Swipe cards (drag + buttons), rewind, super like |
| `/matches` | New matches row + conversation list |
| `/chat/[matchId]` | Real-time chat with auto-replies & emoji picker |
| `/likes` | See who liked you (with Gold paywall) |
| `/profile` | My profile with settings & notification toggles |
| `/profile/[profileId]` | Full profile detail view |

### Key Features
- **Swipe mechanics** — drag left/right or use action buttons
- **LIKE / NOPE overlays** during drag with opacity feedback
- **It's a Match! modal** — animated, links to chat
- **Live chat** — auto-reply simulation, emoji quick-picker
- **SwipeVerse Gold** — freemium upgrade modal with pricing tiers
- **Discovery preferences** — distance, age range, visibility
- **Notification toggles** — per-type notification settings
- **Rewind** — undo last swipe

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open browser
# http://localhost:3000
```

## Project Structure

```
swipeverse/
├── app/
│   ├── page.tsx              # Landing
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles + animations
│   ├── auth/page.tsx         # Login / Signup
│   ├── discover/page.tsx     # Swipe screen
│   ├── matches/page.tsx      # Matches + chat list
│   ├── chat/[matchId]/       # Chat conversation
│   ├── likes/page.tsx        # Likes You screen
│   └── profile/
│       ├── page.tsx          # My Profile / Settings
│       └── [profileId]/      # Full profile detail
├── components/
│   ├── AppLayout.tsx         # Navbar + Toast + Modal wrapper
│   ├── Navbar.tsx            # Top navigation bar
│   ├── SwipeCard.tsx         # Draggable profile card
│   ├── MatchModal.tsx        # It's a Match! popup
│   └── Toast.tsx             # Notification toast
├── lib/
│   ├── data.ts               # Mock profiles + match data
│   └── store.tsx             # Global state (React Context)
└── types/
    └── index.ts              # TypeScript interfaces
```

## Resume Highlights

- Built a **full-stack dating app** UI from scratch using Next.js App Router
- Implemented **custom drag-and-drop swipe mechanics** without external libraries
- Managed complex global state with **React Context + hooks**
- Designed a **freemium monetization model** (Gold tier paywall)
- Used **TypeScript** throughout for type safety
- Applied responsive design with **Tailwind CSS** and custom CSS animations
- Simulated **real-time chat** with optimistic updates
