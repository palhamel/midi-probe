import { useState, useEffect } from 'react';
import { LuCircle, LuCheck } from 'react-icons/lu';
import type { MIDIPortInfo } from '../types/midi.ts';

interface DevicePanelProps {
  inputs: MIDIPortInfo[];
  outputs: MIDIPortInfo[];
  monitoredInputs: Set<string>;
  selectedOutput: string | null;
  onToggleInput: (id: string) => void;
  onSelectOutput: (id: string) => void;
}

const ActivityDot = ({ lastActivity }: { lastActivity: number | null }) => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (lastActivity === null) {
      setIsActive(false);
      return;
    }
    setIsActive(true);
    const timer = setTimeout(() => setIsActive(false), 300);
    return () => clearTimeout(timer);
  }, [lastActivity]);

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full transition-colors duration-150
        ${isActive ? 'bg-accent-green shadow-[0_0_6px_rgba(74,222,128,0.5)]' : 'bg-border'}`}
    />
  );
};

const DevicePanel = ({
  inputs,
  outputs,
  monitoredInputs,
  selectedOutput,
  onToggleInput,
  onSelectOutput,
}: DevicePanelProps) => (
  <div className="flex flex-col gap-4 p-3">
    <div>
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Inputs ({inputs.length})
      </h2>
      {inputs.length === 0 ? (
        <p className="text-xs text-text-muted">No input devices detected</p>
      ) : (
        <div className="flex flex-col gap-1">
          {inputs.map((port) => (
            <button
              key={port.id}
              onClick={() => onToggleInput(port.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left
                cursor-pointer transition-colors
                ${monitoredInputs.has(port.id)
                  ? 'bg-accent-blue/10 text-accent-blue border border-accent-blue/30'
                  : 'bg-bg-tertiary text-text-secondary border border-transparent hover:bg-bg-hover'
                }`}
            >
              <ActivityDot lastActivity={port.lastActivity} />
              {monitoredInputs.has(port.id) ? (
                <LuCheck className="w-3 h-3 shrink-0" />
              ) : (
                <LuCircle className="w-3 h-3 shrink-0" />
              )}
              <span className="truncate">{port.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>

    <div>
      <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
        Outputs ({outputs.length})
      </h2>
      {outputs.length === 0 ? (
        <p className="text-xs text-text-muted">No output devices detected</p>
      ) : (
        <div className="flex flex-col gap-1">
          {outputs.map((port) => (
            <button
              key={port.id}
              onClick={() => onSelectOutput(port.id)}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs text-left
                cursor-pointer transition-colors
                ${selectedOutput === port.id
                  ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/30'
                  : 'bg-bg-tertiary text-text-secondary border border-transparent hover:bg-bg-hover'
                }`}
            >
              <span className={`inline-block w-2 h-2 rounded-full
                ${port.state === 'connected' ? 'bg-accent-purple' : 'bg-border'}`}
              />
              <span className="truncate">{port.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default DevicePanel;
