# Product Roadmap

> Last Updated: 2026-03-13
> Version: 2.0.0
> Status: Phase 5 (Advanced Features)

## Phase 1: Core MIDI Monitor -- COMPLETE

**Goal:** Get a working MIDI input monitor with device detection and parsed messages
**Success Criteria:** Can connect a MIDI device, see it listed, and see parsed Note On/Off messages in real-time

### Must-Have Features

- [x] Project scaffolding -- Vite + React + TypeScript + Tailwind v4 setup `XS`
- [x] MIDI access hook -- `useMIDI` hook wrapping `navigator.requestMIDIAccess()` with permission handling `S`
- [x] Device list panel -- Show all connected MIDI input and output ports with state `S`
- [x] Hot-plug detection -- Live device connect/disconnect reflected in UI `S`
- [x] Message parser -- Decode MIDI bytes into human-readable format (Note On/Off, CC, Program Change, Pitch Bend, Aftertouch, System) `M`
- [x] Message log panel -- Scrolling list of parsed messages with timestamps, color-coded by type `S`
- [x] Dark theme layout -- App shell with dark studio aesthetic, header, sidebar, main panel `S`

### Dependencies

- None (greenfield project)

---

## Phase 2: Output Testing -- COMPLETE

**Goal:** Add ability to send MIDI messages to connected output devices
**Success Criteria:** Can send a Note On from the virtual keyboard and hear it on a connected synth

### Must-Have Features

- [x] Output port selector -- Choose which MIDI output to send to `S`
- [x] Virtual keyboard -- Clickable 2-octave piano that sends Note On/Off with configurable velocity and channel `M`
- [x] CC sliders -- 6 configurable CC sliders (Mod Wheel, Volume, Pan, Expression, Cutoff, Resonance) with number input and label `M`
- [x] Pitch bend wheel -- Spring-loaded pitch bend control that returns to center on release `S`
- [x] Program change selector -- Number input + send button for program changes `S`

### Should-Have Features

- [ ] Velocity sensitivity -- Click position on keyboard key maps to velocity `XS`
- [x] Octave shift -- Shift the keyboard range up/down (C0-C8) `XS`
- [x] MIDI channel selector -- Choose output channel 1-16 `XS`

### Dependencies

- Phase 1 device detection and MIDI access

---

## Phase 3: Filtering and UX Polish -- COMPLETE

**Goal:** Make the tool production-ready with filtering, activity indicators, and refined UI
**Success Criteria:** Can filter messages by type/channel, see per-port activity, and the UI feels professional

### Must-Have Features

- [x] Message filtering -- Toggle filters by message type (notes, CC, program change, etc.) `S`
- [x] Channel filter -- Filter messages by MIDI channel `S`
- [x] Activity indicators -- Per-port LED-style dots that flash on MIDI activity `S`
- [x] Clear log button -- Reset the message log `XS`
- [x] Device selector -- Choose which input ports to monitor (instead of all) `S`
- [x] Responsive layout -- Works well on 1024px+ screens, tab-based on mobile/tablet `S`

### Should-Have Features

- [ ] CC number filter -- Filter to specific CC numbers `XS`
- [x] Message rate display -- Show messages/second in header `S`
- [ ] Hex/decimal toggle -- Switch between hex and decimal display for raw data `XS`

### Dependencies

- Phase 1 and 2 core functionality

---

## Phase 4: Export, PWA, and Deployment -- COMPLETE

**Goal:** Make the tool installable and deployable with data export
**Success Criteria:** Deployed to GitHub Pages, can export message logs

### Must-Have Features

- [x] Export log as CSV -- Download filtered message log as CSV file `S`
- [x] Export log as JSON -- Download filtered message log as JSON file `S`
- [ ] PWA manifest -- Service worker, manifest.json, icons for installable app `S`
- [x] GitHub Actions CI -- Lint, typecheck, test, build on push `S`
- [x] GitHub Pages deployment -- Automated deploy to GitHub Pages on push to main `S`
- [x] README -- Professional README with screenshot, features, live demo link `S`
- [x] MIT License `XS`

### Should-Have Features

- [ ] Offline support -- Service worker caches app for offline use `S`
- [x] Keyboard shortcuts -- Space to pause/resume log, C to clear `S`

### Dependencies

- Phases 1-3 complete

---

## Phase 5: Advanced Features (future)

**Goal:** Power-user features for advanced MIDI debugging
**Success Criteria:** SysEx support working, latency measurement functional

### Should-Have Features

- [ ] SysEx monitor -- Request SysEx access, display device identity replies `M`
- [ ] Latency measurement -- Round-trip timing with loopback device `M`
- [ ] MIDI routing -- Route input to output (software MIDI through) `M`
- [ ] Custom CC mapping -- Name and save custom CC label presets per device `S`
- [ ] Session recording -- Record and replay MIDI sessions `L`
- [ ] Multiple monitor tabs -- Open separate monitor views for different ports `M`

### Remaining from earlier phases

- [ ] Velocity sensitivity -- Click position on keyboard key maps to velocity `XS`
- [ ] CC number filter -- Filter to specific CC numbers `XS`
- [ ] Hex/decimal toggle -- Switch between hex and decimal display for raw data `XS`
- [ ] PWA manifest -- Service worker, manifest.json, icons for installable app `S`
- [ ] Offline support -- Service worker caches app for offline use `S`

### Dependencies

- All prior phases complete
