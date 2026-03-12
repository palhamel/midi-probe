# CLAUDE.md -- MIDI Probe

> Browser-based MIDI diagnostic and testing tool

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
- Live URL: https://palhamel.github.io/midi-probe/

## Architecture Notes

- **Device panel** groups MIDI ports by manufacturer/interface, not flat input/output lists
- **Header** MIDI indicator is status-only (non-clickable) -- scanning is in the device panel
- **Output messages** are logged in the message log alongside incoming messages
- **Message buffer** is capped at 2000 entries to prevent memory issues
- **NoAccessScreen** replaces the main UI when MIDI access is missing -- guides the user through setup
- **HelpModal** (About button) contains feature guide, MIDI intro, and MIDI history with external links
- **CC slider labels** are clickable to reset to default values
- **Keyboard hover tooltip** shows note name and MIDI number
- All interactive controls must work on **touch devices** (iPad) -- no keyboard-only features
- CI uses `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24` to avoid Node.js 20 deprecation warnings
- Made by [Code Rebel](https://coderebel.se/)
