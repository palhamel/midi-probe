# Product Mission

> Last Updated: 2026-03-12
> Version: 1.0.0

## Pitch

MIDI Probe is a professional browser-based MIDI diagnostic tool that helps musicians, synth enthusiasts, and audio engineers test, monitor, and debug MIDI hardware by providing real-time message parsing, output testing, and device management -- all from a single browser tab with zero installation.

## Users

### Primary Customers

- **Musicians and synthesizer enthusiasts:** People who own MIDI hardware and need to verify connections, test controllers, and debug signal routing between devices
- **Audio engineers and producers:** Professionals setting up complex MIDI rigs in studios or live environments who need quick diagnostic access
- **MIDI developers:** Software developers building MIDI-enabled applications who need a reference tool for testing input/output

### User Personas

**The Synth Nerd** (25-45 years old)
- **Role:** Hobbyist musician / producer
- **Context:** Has multiple MIDI keyboards, controllers, and drum machines connected via USB. Frequently reconfigures setups.
- **Pain Points:** No quick way to verify if a controller is sending the right CC values, debugging requires launching a full DAW, existing tools are ugly or desktop-only
- **Goals:** Instantly see what MIDI data a device is sending, send test notes to verify output routing works

**The Studio Engineer** (30-50 years old)
- **Role:** Professional audio engineer
- **Context:** Manages complex MIDI routing in recording studios. Needs to quickly diagnose when something stops working.
- **Pain Points:** MIDI debugging is time-consuming, most tools show raw hex bytes instead of human-readable data, no good browser-based option
- **Goals:** Quickly identify which device is sending what, verify MIDI channels and CC mappings, export logs for documentation

**The MIDI Developer** (25-40 years old)
- **Role:** Software developer building music applications
- **Context:** Building MIDI-enabled web or desktop apps, needs a reference monitor during development.
- **Pain Points:** Browser DevTools don't show MIDI data, building a custom monitor for every project is wasteful
- **Goals:** Have a reliable reference tool open alongside development, verify Web MIDI API behavior across browsers

## The Problem

### MIDI debugging is unnecessarily painful

Musicians and engineers spend significant time diagnosing MIDI connectivity issues. When a controller doesn't respond, the typical workflow involves launching a full DAW, navigating to MIDI preferences, and trying to figure out what's wrong -- a process that can take 5-10 minutes for what should be a 10-second check.

**Our Solution:** A browser tab that instantly shows all connected MIDI devices, parses incoming messages into human-readable format, and lets you send test signals to verify output routing.

### Existing tools show raw data, not useful information

Most MIDI monitor tools display raw status bytes (144, 60, 127) instead of meaningful labels (Note On, C4, velocity 127). Users must mentally decode MIDI protocol to understand what they're seeing.

**Our Solution:** Every MIDI message is parsed and displayed with human-readable labels -- note names, CC names, channel numbers, velocity values -- with color-coded message types for instant visual scanning.

### No good way to test MIDI output without a DAW

Verifying that a MIDI output port is working requires opening a DAW or synthesizer software. There's no lightweight way to just send a test note or CC message to check routing.

**Our Solution:** Built-in output testing with a virtual keyboard, CC sliders, and program change controls that can send MIDI to any connected output device.

## Differentiators

### Zero-install browser-based tool

Unlike desktop MIDI monitors (MIDI Monitor for Mac, MIDI-OX for Windows) that require installation, MIDI Probe runs entirely in the browser. Open a URL and start testing. Works on any Chromium browser, deployable as a PWA for offline use.

### Human-readable message parsing with pro UI

Unlike raw byte dumps from existing tools, MIDI Probe shows parsed, color-coded messages with note names (C#4), CC labels (CC#7 Volume), and channel info. The dark-themed UI is designed to feel like professional audio software, not a developer debug tool.

### Bidirectional testing -- monitor AND send

Unlike most MIDI monitors that are input-only, MIDI Probe includes output testing with a virtual keyboard, CC sliders, pitch bend wheel, and program change selector. Test your entire MIDI chain from one tool.

## Key Features

### Monitoring Features

- **Device Discovery:** Auto-detect all connected MIDI input and output ports with live connect/disconnect updates
- **Message Parser:** Real-time parsing of all MIDI message types into human-readable format (Note On/Off, CC, Program Change, Pitch Bend, Aftertouch, SysEx)
- **Activity Indicators:** Per-port LED-style indicators showing real-time MIDI activity
- **Message Filtering:** Filter by message type, MIDI channel, or specific CC numbers to focus on what matters
- **Message Log:** Scrolling log with timestamps, exportable as CSV or JSON

### Output Testing Features

- **Virtual Keyboard:** Clickable piano keyboard that sends Note On/Off messages to selected output port
- **CC Sliders:** Configurable sliders for sending Control Change messages (volume, pan, modulation, etc.)
- **Pitch Bend Wheel:** Spring-loaded pitch bend control with visual feedback
- **Program Change Selector:** Send program/bank changes to test patch selection

### Utility Features

- **Device Selector:** Choose which input/output ports to monitor and test
- **Dark Theme:** Professional dark UI optimized for studio environments
- **PWA Support:** Install as a standalone app, works offline after first load
- **Responsive Layout:** Works on desktop and tablet screens
