import { describe, it, expect } from 'vitest';
import {
  noteToName,
  getMessageType,
  getChannel,
  parseMIDIMessage,
  getTypeColor,
  getTypeBgColor,
  messageTypeToFilterKey,
} from './midiParser.ts';

describe('noteToName', () => {
  it('converts MIDI note 60 to C4', () => {
    expect(noteToName(60)).toBe('C4');
  });

  it('converts MIDI note 69 to A4', () => {
    expect(noteToName(69)).toBe('A4');
  });

  it('converts MIDI note 0 to C-1', () => {
    expect(noteToName(0)).toBe('C-1');
  });

  it('converts MIDI note 127 to G9', () => {
    expect(noteToName(127)).toBe('G9');
  });

  it('handles sharps correctly', () => {
    expect(noteToName(61)).toBe('C#4');
    expect(noteToName(63)).toBe('D#4');
    expect(noteToName(66)).toBe('F#4');
  });
});

describe('getMessageType', () => {
  it('identifies Note Off (0x80)', () => {
    expect(getMessageType(0x80)).toBe('note_off');
    expect(getMessageType(0x8f)).toBe('note_off');
  });

  it('identifies Note On (0x90)', () => {
    expect(getMessageType(0x90)).toBe('note_on');
    expect(getMessageType(0x9f)).toBe('note_on');
  });

  it('identifies Control Change (0xB0)', () => {
    expect(getMessageType(0xb0)).toBe('control_change');
  });

  it('identifies Program Change (0xC0)', () => {
    expect(getMessageType(0xc0)).toBe('program_change');
  });

  it('identifies Pitch Bend (0xE0)', () => {
    expect(getMessageType(0xe0)).toBe('pitch_bend');
  });

  it('identifies Aftertouch (0xA0)', () => {
    expect(getMessageType(0xa0)).toBe('aftertouch');
  });

  it('identifies Channel Pressure (0xD0)', () => {
    expect(getMessageType(0xd0)).toBe('channel_pressure');
  });

  it('identifies SysEx (0xF0)', () => {
    expect(getMessageType(0xf0)).toBe('sysex');
  });

  it('identifies Clock (0xF8)', () => {
    expect(getMessageType(0xf8)).toBe('clock');
  });

  it('identifies Active Sensing (0xFE)', () => {
    expect(getMessageType(0xfe)).toBe('active_sensing');
  });

  it('returns unknown for unrecognized status', () => {
    expect(getMessageType(0xf1)).toBe('unknown');
  });
});

describe('getChannel', () => {
  it('extracts channel 1 from status 0x90', () => {
    expect(getChannel(0x90)).toBe(1);
  });

  it('extracts channel 16 from status 0x9F', () => {
    expect(getChannel(0x9f)).toBe(16);
  });

  it('extracts channel 10 from status 0xB9', () => {
    expect(getChannel(0xb9)).toBe(10);
  });

  it('returns null for system messages', () => {
    expect(getChannel(0xf0)).toBeNull();
    expect(getChannel(0xf8)).toBeNull();
    expect(getChannel(0xfe)).toBeNull();
  });
});

describe('parseMIDIMessage', () => {
  it('parses Note On message', () => {
    const data = new Uint8Array([0x90, 60, 100]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('note_on');
    expect(result.channel).toBe(1);
    expect(result.label).toBe('Note On C4');
    expect(result.detail).toBe('Note 60, Vel 100');
    expect(result.portName).toBe('Test Port');
  });

  it('treats Note On with velocity 0 as Note Off', () => {
    const data = new Uint8Array([0x90, 60, 0]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('note_off');
    expect(result.label).toBe('Note Off C4');
  });

  it('parses Note Off message', () => {
    const data = new Uint8Array([0x80, 64, 0]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('note_off');
    expect(result.label).toBe('Note Off E4');
  });

  it('parses Control Change with known CC name', () => {
    const data = new Uint8Array([0xb0, 7, 100]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('control_change');
    expect(result.label).toBe('Volume');
    expect(result.detail).toBe('CC 7, Value 100');
  });

  it('parses Control Change with unknown CC number', () => {
    const data = new Uint8Array([0xb0, 42, 50]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('control_change');
    expect(result.label).toBe('CC#42');
  });

  it('parses Program Change', () => {
    const data = new Uint8Array([0xc0, 5]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('program_change');
    expect(result.label).toBe('Program 5');
  });

  it('parses Pitch Bend at center', () => {
    const data = new Uint8Array([0xe0, 0, 64]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('pitch_bend');
    expect(result.label).toContain('Pitch Bend');
  });

  it('parses Pitch Bend positive', () => {
    const data = new Uint8Array([0xe0, 0, 127]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    const value = ((127 << 7) | 0) - 8192;
    expect(result.label).toBe(`Pitch Bend ${value}`);
  });

  it('parses Aftertouch', () => {
    const data = new Uint8Array([0xa0, 60, 80]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('aftertouch');
    expect(result.label).toBe('Aftertouch C4');
  });

  it('parses Channel Pressure', () => {
    const data = new Uint8Array([0xd0, 90]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('channel_pressure');
    expect(result.label).toBe('Ch Pressure 90');
  });

  it('parses SysEx', () => {
    const data = new Uint8Array([0xf0, 0x7e, 0x7f, 0x06, 0x01, 0xf7]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.type).toBe('sysex');
    expect(result.label).toBe('SysEx');
    expect(result.detail).toBe('6 bytes');
  });

  it('parses on correct MIDI channel', () => {
    const data = new Uint8Array([0x95, 60, 100]);
    const result = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);

    expect(result.channel).toBe(6);
  });

  it('assigns unique IDs', () => {
    const data = new Uint8Array([0x90, 60, 100]);
    const r1 = parseMIDIMessage(data, 'port-1', 'Test Port', 1000);
    const r2 = parseMIDIMessage(data, 'port-1', 'Test Port', 1001);
    expect(r1.id).not.toBe(r2.id);
  });
});

describe('messageTypeToFilterKey', () => {
  it('maps note_on to noteOn', () => {
    expect(messageTypeToFilterKey('note_on')).toBe('noteOn');
  });

  it('maps control_change to controlChange', () => {
    expect(messageTypeToFilterKey('control_change')).toBe('controlChange');
  });

  it('maps unknown types to unknown', () => {
    expect(messageTypeToFilterKey('unknown')).toBe('unknown');
  });
});

describe('getTypeColor', () => {
  it('returns green for note_on', () => {
    expect(getTypeColor('note_on')).toBe('text-accent-green');
  });

  it('returns red for note_off', () => {
    expect(getTypeColor('note_off')).toBe('text-accent-red');
  });

  it('returns blue for control_change', () => {
    expect(getTypeColor('control_change')).toBe('text-accent-blue');
  });

  it('returns muted for unknown', () => {
    expect(getTypeColor('unknown')).toBe('text-text-muted');
  });
});

describe('getTypeBgColor', () => {
  it('returns green bg for note_on', () => {
    expect(getTypeBgColor('note_on')).toBe('bg-accent-green/10');
  });

  it('returns tertiary bg for unknown', () => {
    expect(getTypeBgColor('unknown')).toBe('bg-bg-tertiary');
  });
});
