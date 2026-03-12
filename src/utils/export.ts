import type { ParsedMIDIMessage } from '../types/midi.ts';

export const exportAsCSV = (messages: ParsedMIDIMessage[], filename = 'midi-log'): void => {
  const header = 'Timestamp,Port,Channel,Type,Label,Detail,Raw Data\n';
  const rows = messages.map(msg => {
    const raw = Array.from(msg.data).map(b => b.toString(16).padStart(2, '0')).join(' ');
    const time = new Date(msg.timestamp).toISOString();
    return `${time},"${msg.portName}",${msg.channel ?? '-'},${msg.type},"${msg.label}","${msg.detail}",${raw}`;
  });

  const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' });
  downloadBlob(blob, `${filename}.csv`);
};

export const exportAsJSON = (messages: ParsedMIDIMessage[], filename = 'midi-log'): void => {
  const data = messages.map(msg => ({
    timestamp: new Date(msg.timestamp).toISOString(),
    port: msg.portName,
    channel: msg.channel,
    type: msg.type,
    label: msg.label,
    detail: msg.detail,
    raw: Array.from(msg.data).map(b => b.toString(16).padStart(2, '0')),
  }));

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${filename}.json`);
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
