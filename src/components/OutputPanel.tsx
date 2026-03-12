import { useState, useCallback } from 'react';
import Keyboard from './Keyboard.tsx';
import CCSliders from './CCSliders.tsx';
import PitchBend from './PitchBend.tsx';
import ProgramChange from './ProgramChange.tsx';

interface OutputPanelProps {
  selectedOutput: string | null;
  outputName: string;
  sendMessage: (outputId: string, data: number[]) => void;
}

const OutputPanel = ({ selectedOutput, outputName, sendMessage }: OutputPanelProps) => {
  const [channel, setChannel] = useState(1);
  const [octave, setOctave] = useState(3);
  const [velocity, setVelocity] = useState(100);

  const send = useCallback((data: number[]) => {
    if (!selectedOutput) return;
    sendMessage(selectedOutput, data);
  }, [selectedOutput, sendMessage]);

  const handleNoteOn = useCallback((note: number) => {
    send([0x90 | (channel - 1), note, velocity]);
  }, [send, channel, velocity]);

  const handleNoteOff = useCallback((note: number) => {
    send([0x80 | (channel - 1), note, 0]);
  }, [send, channel]);

  const handleCCChange = useCallback((cc: number, value: number) => {
    send([0xb0 | (channel - 1), cc, value]);
  }, [send, channel]);

  const handlePitchBend = useCallback((value: number) => {
    const lsb = value & 0x7f;
    const msb = (value >> 7) & 0x7f;
    send([0xe0 | (channel - 1), lsb, msb]);
  }, [send, channel]);

  const handleProgramChange = useCallback((program: number) => {
    send([0xc0 | (channel - 1), program]);
  }, [send, channel]);

  if (!selectedOutput) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted text-sm p-4">
        Select an output device to send MIDI
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-3 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Output
          </h2>
          <span className="text-xs text-accent-purple">{outputName}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[10px] text-text-muted">Ch</label>
          <select
            value={channel}
            onChange={(e) => setChannel(parseInt(e.target.value))}
            className="text-xs font-mono bg-bg-tertiary border border-border rounded
                       px-1.5 py-1 text-text-secondary cursor-pointer
                       focus:outline-none focus:border-accent-blue"
          >
            {Array.from({ length: 16 }, (_, i) => i + 1).map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
          <label className="text-[10px] text-text-muted">Vel</label>
          <input
            type="number"
            min={1}
            max={127}
            value={velocity}
            onChange={(e) => setVelocity(Math.min(127, Math.max(1, parseInt(e.target.value) || 100)))}
            className="w-12 text-xs font-mono text-center bg-bg-tertiary
                       border border-border rounded px-1 py-1 text-text-secondary
                       focus:outline-none focus:border-accent-blue"
          />
        </div>
      </div>

      <Keyboard
        octave={octave}
        onOctaveChange={setOctave}
        onNoteOn={handleNoteOn}
        onNoteOff={handleNoteOff}
      />

      <div className="flex gap-4">
        <div className="flex-1">
          <CCSliders onCCChange={handleCCChange} />
        </div>
        <div className="flex flex-col gap-4">
          <PitchBend onPitchBend={handlePitchBend} />
          <ProgramChange onProgramChange={handleProgramChange} />
        </div>
      </div>
    </div>
  );
};

export default OutputPanel;
