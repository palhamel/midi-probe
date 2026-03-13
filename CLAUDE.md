# CLAUDE.md -- MIDI-koll

> Browser-based MIDI diagnostic and testing tool

## Current Status

**Phases 1-4 complete.** All core features are production-ready and deployed.
- Live URL: https://palhamel.github.io/midi-koll/
- 47 passing tests, CI/CD via GitHub Actions, deployed to GitHub Pages
- Next work: Phase 5 (advanced features -- SysEx, latency measurement, MIDI routing, session recording)

## Agent OS Documentation

### Product Context
- **Mission & Vision:** @.agent-os/product/mission.md
- **Technical Architecture:** @.agent-os/product/tech-stack.md
- **Development Roadmap:** @.agent-os/product/roadmap.md
- **Decision History:** @.agent-os/product/decisions.md

### Development Standards
- **Code Style:** @~/.agent-os/standards/code-style.md
- **Best Practices:** @~/.agent-os/standards/best-practices.md

### Project Management
- **Active Specs:** @.agent-os/specs/
- **Spec Planning:** Use `@~/.agent-os/instructions/create-spec.md`
- **Tasks Execution:** Use `@~/.agent-os/instructions/execute-tasks.md`

## Workflow Instructions

When asked to work on this codebase:

1. **First**, check @.agent-os/product/roadmap.md for current priorities
2. **Then**, follow the appropriate instruction file:
   - For new features: @.agent-os/instructions/create-spec.md
   - For tasks execution: @.agent-os/instructions/execute-tasks.md
3. **Always**, adhere to the standards in the files listed above

## Important Notes

- Product-specific files in `.agent-os/product/` override any global standards
- User's specific instructions override (or amend) instructions found in `.agent-os/specs/...`
- Always adhere to established patterns, code style, and best practices documented above.

## Project-Specific Notes

- This is a **client-side only** application -- no backend, no database, no API
- All MIDI functionality uses the **Web MIDI API** (`navigator.requestMIDIAccess()`)
- Web MIDI API is **Chromium-only** -- Firefox and Safari are not supported
- UI should feel like **professional audio software** -- dark theme, clean, functional
- The virtual keyboard and CC sliders are core differentiating features -- not afterthoughts
- Target deployment: **GitHub Pages** (static files only)
- Live URL: https://palhamel.github.io/midi-koll/

## Tech Stack (actual)

- **React 19** + **TypeScript 5.9** + **Vite 7** + **Tailwind CSS v4**
- **4 production deps:** react, react-dom, react-icons, tailwindcss
- **Node 22 LTS**, npm
- **Vitest** for testing (jsdom environment)
- **ESLint** with React Hooks plugin

## Architecture Notes

- **App layout:** 3-column on desktop (208px device sidebar, flex message log, 320px output/filter sidebar), tab-based on mobile/tablet
- **`useMIDI` hook** (`src/hooks/useMIDI.ts`) -- central hook wrapping Web MIDI API, manages ports, message parsing, filtering, activity tracking, message rate, output sending
- **Device panel** groups MIDI ports by manufacturer/interface, not flat input/output lists
- **Header** MIDI indicator is status-only (non-clickable) -- scanning is in the device panel
- **Output messages** are logged in the message log alongside incoming messages
- **Message buffer** is capped at 2000 entries to prevent memory issues
- **NoAccessScreen** replaces the main UI when MIDI access is missing -- guides the user through setup
- **HelpModal** (About button) contains feature guide, MIDI intro, and MIDI history with external links
- **CC slider labels** are clickable to reset to default values (6 default sliders: Mod Wheel, Volume, Pan, Expression, Cutoff, Resonance)
- **Keyboard** is 2-octave virtual piano (C0-C8 range, adjustable) with hover tooltip showing note name and MIDI number
- **Pitch bend** is spring-loaded (returns to center on release), 14-bit resolution
- All interactive controls must work on **touch devices** (iPad) -- pointer events used throughout
- **Keyboard shortcuts:** Space = pause/resume log, C = clear messages
- **Export:** CSV and JSON download of filtered message log
- Uses refs to sync filter state in callbacks for React 19 strict mode compliance
- CI uses `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` to avoid Node.js 20 deprecation warnings

## File Structure

```
src/
├── App.tsx                    # Main app -- layout, state, keyboard shortcuts
├── components/
│   ├── Header.tsx             # Status bar, MIDI indicator, About button
│   ├── DevicePanel.tsx        # Device list grouped by manufacturer
│   ├── MessageLog.tsx         # Real-time parsed message log + export
│   ├── FilterPanel.tsx        # Message type & channel filters
│   ├── OutputPanel.tsx        # Output testing orchestrator
│   ├── Keyboard.tsx           # Virtual piano (2-octave)
│   ├── CCSliders.tsx          # 6 configurable CC sliders
│   ├── PitchBend.tsx          # Spring-loaded pitch bend wheel
│   ├── ProgramChange.tsx      # Program change sender (0-127)
│   ├── NoAccessScreen.tsx     # Setup guide when MIDI unavailable
│   ├── HelpModal.tsx          # About/help modal
│   └── ErrorBanner.tsx        # Error display
├── hooks/
│   └── useMIDI.ts             # Core MIDI hook (all MIDI logic)
├── utils/
│   ├── midiParser.ts          # MIDI byte parsing + human-readable labels
│   ├── midiParser.test.ts
│   ├── export.ts              # CSV/JSON export
│   └── export.test.ts
├── types/
│   ├── midi.ts                # TypeScript types & defaults
│   └── midi.test.ts
└── test/
    └── setup.ts               # Vitest config
```

## Made by

[Code Rebel](https://coderebel.se/)
