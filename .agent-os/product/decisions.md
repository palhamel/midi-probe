# Product Decisions Log

> Last Updated: 2026-03-12
> Version: 1.0.0
> Override Priority: Highest

**Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**

## 2026-03-12: Initial Product Planning

**ID:** DEC-001
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Owner

### Decision

Build MIDI Probe as a professional browser-based MIDI diagnostic and testing tool. The tool monitors MIDI input with human-readable message parsing and provides output testing via virtual keyboard, CC sliders, and pitch bend. Target audience is musicians, synth enthusiasts, and MIDI developers. Replaces the abandoned `webMIDI-IO-app` repo with a complete rewrite in a new repository.

### Context

The existing `webMIDI-IO-app` (2021) is a minimal vanilla JS MIDI scanner that only shows raw bytes. The Web MIDI API is stable and unchanged, but the app doesn't parse messages, can't send MIDI output, and has no modern UI. A full rewrite with React/TypeScript/Tailwind is the right approach rather than incremental updates to the old codebase. The owner (Pål) is a synthesizer enthusiast who uses MIDI hardware regularly and wants a tool he'd actually use.

### Alternatives Considered

1. **Incremental update of webMIDI-IO-app**
   - Pros: Less work, preserves git history
   - Cons: Vanilla JS is limiting, no component architecture, would end up rewriting everything anyway

2. **Use existing tool (Web MIDI Monitor, etc.)**
   - Pros: Zero effort
   - Cons: No output testing capability, ugly UIs, not self-hosted, can't customize

3. **Desktop app (Electron/Tauri)**
   - Pros: No browser MIDI API limitations, cross-platform
   - Cons: Requires installation, heavier to build, overkill for this use case

### Rationale

Browser-based approach maximizes accessibility (open a URL and go), the Web MIDI API covers all needed functionality, and React/TypeScript/Tailwind matches the owner's standard tech stack. The output testing feature (virtual keyboard + CC sliders) is the key differentiator that makes this more than just another MIDI monitor.

### Consequences

**Positive:**
- Professional portfolio piece combining music + tech interests
- Actually useful tool for personal MIDI debugging
- Lightweight, zero-install, deployable anywhere

**Negative:**
- Chromium-only (Firefox/Safari don't support Web MIDI API)
- No SysEx support without explicit user permission grant
- Can't access MIDI on mobile browsers (API not available on iOS/Android)

---

## 2026-03-12: New Repository Instead of Rewriting In-Place

**ID:** DEC-002
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Product Owner

### Decision

Create a new repository (`midi-probe`) instead of rewriting within the existing `webMIDI-IO-app` repo. The old repo will be set to private.

### Context

The old repo has 6 commits of vanilla JS code from 2021. None of it is reusable in the new React/TypeScript architecture. Starting fresh provides a clean git history that reflects the actual project.

### Rationale

Clean separation. The old repo serves no purpose for the new architecture and keeping it around as a public repo with outdated code adds noise to the GitHub profile.

### Consequences

**Positive:**
- Clean git history from day one
- No legacy code confusion
- Clear project identity with new name

**Negative:**
- Loses the 2021 creation date (minor -- git history of old repo is trivial)
