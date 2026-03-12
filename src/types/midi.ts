export type MIDIMessageType =
  | 'note_off'
  | 'note_on'
  | 'aftertouch'
  | 'control_change'
  | 'program_change'
  | 'channel_pressure'
  | 'pitch_bend'
  | 'sysex'
  | 'clock'
  | 'active_sensing'
  | 'unknown';

export interface ParsedMIDIMessage {
  id: string;
  timestamp: number;
  type: MIDIMessageType;
  channel: number | null;
  data: Uint8Array;
  label: string;
  detail: string;
  portId: string;
  portName: string;
}

export interface MIDIPortInfo {
  id: string;
  name: string;
  manufacturer: string;
  state: string;
  type: 'input' | 'output';
  connection: string;
  lastActivity: number | null;
}

export interface MIDIFilter {
  noteOn: boolean;
  noteOff: boolean;
  controlChange: boolean;
  programChange: boolean;
  pitchBend: boolean;
  aftertouch: boolean;
  channelPressure: boolean;
  sysex: boolean;
  clock: boolean;
  channels: Set<number>;
}

export const DEFAULT_FILTER: MIDIFilter = {
  noteOn: true,
  noteOff: true,
  controlChange: true,
  programChange: true,
  pitchBend: true,
  aftertouch: true,
  channelPressure: true,
  sysex: true,
  clock: false,
  channels: new Set(Array.from({ length: 16 }, (_, i) => i + 1)),
};
