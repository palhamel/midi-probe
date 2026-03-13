# MIDI-koll

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-47_passing-4ade80)](https://github.com/palhamel/midi-koll/actions)
[![MIDI](https://img.shields.io/badge/-MIDI-000000?style=flat&logo=midi&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API)

**Use it live in your browser:** [palhamel.github.io/midi-koll](https://palhamel.github.io/midi-koll/)

Professional browser-based MIDI diagnostic and testing tool. Monitor MIDI inputs with human-readable message parsing, test outputs with a virtual keyboard and CC sliders -- all from a single browser tab.

```
MIDI-koll -> 'koll' is the Swedish word for 'overview'

This is actually a very handy tool when you need to debug your MIDI pipeline.
```
## Features

### Device Management
- Ports grouped by MIDI interface/manufacturer
- Scan button to re-detect devices
- MIDI access status indicator in header
- Per-port activity indicators with IN/OUT labels
- Guided setup screen when MIDI access is missing or browser is unsupported

### Input Monitoring
- Auto-detect all connected MIDI input and output ports
- Live device connect/disconnect detection
- Real-time message parsing: Note On/Off, CC, Program Change, Pitch Bend, Aftertouch, SysEx
- Human-readable labels (Note On C4, CC#7 Volume, Pitch Bend +4096)
- Color-coded message types for visual scanning
- Scrolling message log with timestamps (2000 message buffer)
- Newest message highlighted for quick scanning

### Output Testing
- Virtual 2-octave piano keyboard with octave shift and note hover tooltip
- 6 CC sliders with click-to-reset labels (Mod Wheel, Volume, Pan, Expression, Cutoff, Resonance)
- Horizontal spring-loaded pitch bend (returns to center on release)
- Program change sender with manual value input
- Outgoing messages logged in the message log
- Configurable MIDI channel (1-16) and velocity

### Filtering and Export
- Filter by message type (Note On, CC, Program Change, etc.)
- Filter by MIDI channel (1-16)
- Export message log as CSV or JSON
- Pause/resume log capture
- Keyboard shortcuts: Space = pause, C = clear

### Help and Documentation
- Built-in About page with feature guide
- MIDI introduction and history with external references

## Quick Start

```bash
git clone https://github.com/palhamel/midi-koll.git
cd midi-koll
npm install
npm run dev
```

Open http://localhost:5173/midi-koll/ in Chrome, Edge, or Opera.

## Browser Support

MIDI-koll uses the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API), which is available in Chromium-based browsers only:

- Chrome 43+
- Edge 79+
- Opera 30+

Firefox and Safari do not support the Web MIDI API. If the browser lacks MIDI support, MIDI-koll displays a guided screen explaining supported alternatives.

## Tech Stack

- React 19 + TypeScript 5.9
- Vite 7
- Tailwind CSS v4
- Vitest (47 tests)
- ESLint with React Hooks plugin

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Type check + production build |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type check |

## Project Structure

```
src/
  App.tsx                  # Main app layout with no-access handling
  hooks/
    useMIDI.ts             # Core MIDI hook (Web MIDI API wrapper)
  components/
    Header.tsx             # Status bar with MIDI access indicator and About button
    DevicePanel.tsx        # Device list grouped by interface with scan button
    MessageLog.tsx         # Scrolling parsed message log with newest highlight
    FilterPanel.tsx        # Message type and channel filters
    OutputPanel.tsx        # Output testing panel (orchestrator)
    Keyboard.tsx           # Virtual piano keyboard with note hover tooltip
    CCSliders.tsx          # Control Change sliders with click-to-reset
    PitchBend.tsx          # Horizontal pitch bend slider
    ProgramChange.tsx      # Program change sender
    NoAccessScreen.tsx     # Guided setup when MIDI is unavailable
    HelpModal.tsx          # About page with feature guide and MIDI history
    ErrorBanner.tsx        # Error display
  utils/
    midiParser.ts          # MIDI byte parsing and labeling
    export.ts              # CSV/JSON export
  types/
    midi.ts                # TypeScript types and defaults
```

## License

MIT
