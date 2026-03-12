import { describe, it, expect } from 'vitest';
import { DEFAULT_FILTER } from './midi.ts';

describe('DEFAULT_FILTER', () => {
  it('has all message types enabled by default', () => {
    expect(DEFAULT_FILTER.noteOn).toBe(true);
    expect(DEFAULT_FILTER.noteOff).toBe(true);
    expect(DEFAULT_FILTER.controlChange).toBe(true);
    expect(DEFAULT_FILTER.programChange).toBe(true);
    expect(DEFAULT_FILTER.pitchBend).toBe(true);
    expect(DEFAULT_FILTER.aftertouch).toBe(true);
    expect(DEFAULT_FILTER.channelPressure).toBe(true);
    expect(DEFAULT_FILTER.sysex).toBe(true);
  });

  it('has clock disabled by default', () => {
    expect(DEFAULT_FILTER.clock).toBe(false);
  });

  it('has all 16 channels enabled', () => {
    expect(DEFAULT_FILTER.channels.size).toBe(16);
    for (let i = 1; i <= 16; i++) {
      expect(DEFAULT_FILTER.channels.has(i)).toBe(true);
    }
  });
});
