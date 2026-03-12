import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportAsCSV, exportAsJSON } from './export.ts';
import type { ParsedMIDIMessage } from '../types/midi.ts';

const mockMessages: ParsedMIDIMessage[] = [
  {
    id: 'msg-1',
    timestamp: new Date('2026-01-01T12:00:00Z').getTime(),
    type: 'note_on',
    channel: 1,
    data: new Uint8Array([0x90, 60, 100]),
    label: 'Note On C4',
    detail: 'Note 60, Vel 100',
    portId: 'port-1',
    portName: 'Test Port',
  },
  {
    id: 'msg-2',
    timestamp: new Date('2026-01-01T12:00:01Z').getTime(),
    type: 'control_change',
    channel: 1,
    data: new Uint8Array([0xb0, 7, 80]),
    label: 'Volume',
    detail: 'CC 7, Value 80',
    portId: 'port-1',
    portName: 'Test Port',
  },
];

describe('exportAsCSV', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a CSV blob and triggers download', () => {
    const mockClick = vi.fn();
    const mockCreateElement = vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement);
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:test');
    const mockRevokeObjectURL = vi.fn();
    URL.createObjectURL = mockCreateObjectURL;
    URL.revokeObjectURL = mockRevokeObjectURL;

    exportAsCSV(mockMessages, 'test-log');

    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test');
  });
});

describe('exportAsJSON', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a JSON blob and triggers download', () => {
    const mockClick = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: mockClick,
      href: '',
      download: '',
    } as unknown as HTMLAnchorElement);
    URL.createObjectURL = vi.fn().mockReturnValue('blob:test');
    URL.revokeObjectURL = vi.fn();

    exportAsJSON(mockMessages, 'test-log');

    expect(mockClick).toHaveBeenCalled();
  });
});
