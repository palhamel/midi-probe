import type { MIDIMessageType, ParsedMIDIMessage } from '../types/midi.ts';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const CC_NAMES: Record<number, string> = {
  0: 'Bank Select MSB',
  1: 'Mod Wheel',
  2: 'Breath',
  4: 'Foot Controller',
  5: 'Portamento Time',
  6: 'Data Entry MSB',
  7: 'Volume',
  8: 'Balance',
  10: 'Pan',
  11: 'Expression',
  32: 'Bank Select LSB',
  64: 'Sustain',
  65: 'Portamento',
  66: 'Sostenuto',
  67: 'Soft Pedal',
  71: 'Resonance',
  74: 'Cutoff',
  91: 'Reverb',
  93: 'Chorus',
  120: 'All Sound Off',
  121: 'Reset Controllers',
  123: 'All Notes Off',
};

let messageCounter = 0;

export const noteToName = (note: number): string => {
  const octave = Math.floor(note / 12) - 1;
  const name = NOTE_NAMES[note % 12];
  return `${name}${octave}`;
};

export const getMessageType = (status: number): MIDIMessageType => {
  if (status >= 0xf0) {
    if (status === 0xf0) return 'sysex';
    if (status === 0xf8) return 'clock';
    if (status === 0xfe) return 'active_sensing';
    return 'unknown';
  }

  const type = status & 0xf0;
  switch (type) {
    case 0x80: return 'note_off';
    case 0x90: return 'note_on';
    case 0xa0: return 'aftertouch';
    case 0xb0: return 'control_change';
    case 0xc0: return 'program_change';
    case 0xd0: return 'channel_pressure';
    case 0xe0: return 'pitch_bend';
    default: return 'unknown';
  }
};

export const getChannel = (status: number): number | null => {
  if (status >= 0xf0) return null;
  return (status & 0x0f) + 1;
};

export const parseMIDIMessage = (
  data: Uint8Array,
  portId: string,
  portName: string,
  timestamp: number,
): ParsedMIDIMessage => {
  const status = data[0];
  const type = getMessageType(status);
  const channel = getChannel(status);
  const id = `msg-${++messageCounter}`;

  let label = '';
  let detail = '';

  switch (type) {
    case 'note_on': {
      const note = data[1];
      const velocity = data[2];
      if (velocity === 0) {
        label = `Note Off ${noteToName(note)}`;
        detail = `Note ${note}, Vel 0`;
        return { id, timestamp, type: 'note_off', channel, data, label, detail, portId, portName };
      }
      label = `Note On ${noteToName(note)}`;
      detail = `Note ${note}, Vel ${velocity}`;
      break;
    }
    case 'note_off': {
      const note = data[1];
      const velocity = data[2];
      label = `Note Off ${noteToName(note)}`;
      detail = `Note ${note}, Vel ${velocity}`;
      break;
    }
    case 'control_change': {
      const cc = data[1];
      const value = data[2];
      const ccName = CC_NAMES[cc] || `CC#${cc}`;
      label = ccName;
      detail = `CC ${cc}, Value ${value}`;
      break;
    }
    case 'program_change': {
      const program = data[1];
      label = `Program ${program}`;
      detail = `Program Change ${program}`;
      break;
    }
    case 'pitch_bend': {
      const lsb = data[1];
      const msb = data[2];
      const value = ((msb << 7) | lsb) - 8192;
      label = `Pitch Bend ${value}`;
      detail = `Value ${value} (${lsb}, ${msb})`;
      break;
    }
    case 'aftertouch': {
      const note = data[1];
      const pressure = data[2];
      label = `Aftertouch ${noteToName(note)}`;
      detail = `Note ${note}, Pressure ${pressure}`;
      break;
    }
    case 'channel_pressure': {
      const pressure = data[1];
      label = `Ch Pressure ${pressure}`;
      detail = `Pressure ${pressure}`;
      break;
    }
    case 'sysex':
      label = 'SysEx';
      detail = `${data.length} bytes`;
      break;
    case 'clock':
      label = 'Clock';
      detail = 'Timing Clock';
      break;
    case 'active_sensing':
      label = 'Active Sensing';
      detail = '';
      break;
    default:
      label = `Unknown (0x${status.toString(16)})`;
      detail = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join(' ');
  }

  return { id, timestamp, type, channel, data, label, detail, portId, portName };
};

export const messageTypeToFilterKey = (type: MIDIMessageType): string => {
  switch (type) {
    case 'note_on': return 'noteOn';
    case 'note_off': return 'noteOff';
    case 'control_change': return 'controlChange';
    case 'program_change': return 'programChange';
    case 'pitch_bend': return 'pitchBend';
    case 'aftertouch': return 'aftertouch';
    case 'channel_pressure': return 'channelPressure';
    case 'sysex': return 'sysex';
    case 'clock': return 'clock';
    case 'active_sensing': return 'clock';
    default: return 'unknown';
  }
};

export const getTypeColor = (type: MIDIMessageType): string => {
  switch (type) {
    case 'note_on': return 'text-accent-green';
    case 'note_off': return 'text-accent-red';
    case 'control_change': return 'text-accent-blue';
    case 'program_change': return 'text-accent-purple';
    case 'pitch_bend': return 'text-accent-cyan';
    case 'aftertouch': return 'text-accent-yellow';
    case 'channel_pressure': return 'text-accent-yellow';
    case 'sysex': return 'text-accent-orange';
    case 'clock': return 'text-text-muted';
    default: return 'text-text-muted';
  }
};

export const getTypeBgColor = (type: MIDIMessageType): string => {
  switch (type) {
    case 'note_on': return 'bg-accent-green/10';
    case 'note_off': return 'bg-accent-red/10';
    case 'control_change': return 'bg-accent-blue/10';
    case 'program_change': return 'bg-accent-purple/10';
    case 'pitch_bend': return 'bg-accent-cyan/10';
    case 'aftertouch': return 'bg-accent-yellow/10';
    case 'channel_pressure': return 'bg-accent-yellow/10';
    case 'sysex': return 'bg-accent-orange/10';
    case 'clock': return 'bg-bg-tertiary';
    default: return 'bg-bg-tertiary';
  }
};
