# Technical Stack

> Last Updated: 2026-03-12
> Version: 1.0.0

## Application Framework

- **Build Tool:** Vite (latest stable)
- **Language:** TypeScript (strict mode)
- **Runtime:** Browser-only (no backend server required)

## Frontend

- **Framework:** React (latest stable)
- **Components:** Functional components with hooks
- **State Management:** React hooks (useState, useEffect, useCallback, useRef)
- **Import Strategy:** ES modules via Vite

## Styling

- **CSS Framework:** Tailwind CSS v4
- **Theme:** Dark theme (studio/pro-audio aesthetic)
- **Color Palette:** Dark greys, subtle accent colors for message types
- **Icons:** React Icons (Lucide set for clean, modern look)
- **Fonts:** Google Fonts -- Inter (UI) + JetBrains Mono (MIDI data/monospace)

## Core Browser APIs

- **Web MIDI API:** `navigator.requestMIDIAccess()` for all MIDI I/O
- **SysEx:** Optional SysEx access for device identity requests
- **Service Worker:** PWA support for offline capability

## Key Dependencies

- `react` + `react-dom` -- UI framework
- `react-icons` -- Icon library
- `tailwindcss` -- Utility CSS
- `typescript` -- Type safety
- `vite` -- Build tooling
- `@vitejs/plugin-react` -- React fast refresh

No additional runtime dependencies. The Web MIDI API is built into Chromium browsers.

## Infrastructure

- **Application Hosting:** GitHub Pages (static site) or Netlify
- **Database:** n/a (no server-side state)
- **Asset Hosting:** Same as application hosting
- **Deployment:** GitHub Actions -- build on push to main, deploy to GitHub Pages
- **Code Repository:** https://github.com/palhamel/midi-probe (to be created)

## Browser Support

- **Primary:** Chrome, Edge, Opera (Chromium-based -- Web MIDI API support)
- **Not supported:** Firefox, Safari (no Web MIDI API)
- **Minimum version:** Chrome 43+ (Web MIDI), recommended Chrome 89+ (permissions policy)

## Development Environment

- **Machine:** MacBook Pro, Apple M3 Pro
- **Editor:** VS Code
- **Package Manager:** npm
- **Node.js:** 22 LTS
