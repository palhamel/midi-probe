# MIDI Probe

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB)](https://react.dev/)
[![Tests](https://img.shields.io/badge/Tests-47_passing-4ade80)]()

Professional browser-based MIDI diagnostic and testing tool. Monitor MIDI inputs with human-readable message parsing, test outputs with a virtual keyboard and CC sliders -- all from a single browser tab.

## Features

### Input Monitoring
- Auto-detect all connected MIDI input and output ports
- Live device connect/disconnect detection
- Real-time message parsing: Note On/Off, CC, Program Change, Pitch Bend, Aftertouch, SysEx
- Human-readable labels (Note On C4, CC#7 Volume, Pitch Bend +4096)
- Color-coded message types for visual scanning
- Per-port activity indicators
- Scrolling message log with timestamps

### Output Testing
- Virtual 2-octave piano keyboard with octave shift
- 6 configurable CC sliders (Mod Wheel, Volume, Pan, Expression, Cutoff, Resonance)
- Spring-loaded pitch bend wheel (returns to center on release)
- Program change sender
- Configurable MIDI channel (1-16) and velocity

### Filtering and Export
- Filter by message type (Note On, CC, Program Change, etc.)
- Filter by MIDI channel (1-16)
- Export message log as CSV or JSON
- Pause/resume log capture
- Keyboard shortcuts: Space = pause, C = clear

## Quick Start

```bash
git clone https://github.com/palhamel/midi-probe.git
cd midi-probe
npm install
npm run dev
```

Open http://localhost:5173/midi-probe/ in Chrome, Edge, or Opera.

## Browser Support

MIDI Probe uses the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API), which is available in Chromium-based browsers only:

- Chrome 43+
- Edge 79+
- Opera 30+

Firefox and Safari do not support the Web MIDI API.

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
  App.tsx                  # Main app layout
  hooks/
    useMIDI.ts             # Core MIDI hook (Web MIDI API wrapper)
  components/
    Header.tsx             # Status bar with connection indicator
    DevicePanel.tsx        # Input/output device list with activity dots
    MessageLog.tsx         # Scrolling parsed message log
    FilterPanel.tsx        # Message type and channel filters
    OutputPanel.tsx        # Output testing panel (orchestrator)
    Keyboard.tsx           # Virtual piano keyboard
    CCSliders.tsx          # Control Change sliders
    PitchBend.tsx          # Pitch bend wheel
    ProgramChange.tsx      # Program change sender
    ErrorBanner.tsx        # Error display
  utils/
    midiParser.ts          # MIDI byte parsing and labeling
    export.ts              # CSV/JSON export
  types/
    midi.ts                # TypeScript types and defaults
```

## License

MIT
