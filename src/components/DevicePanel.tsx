import { useState, useEffect } from 'react';
import { LuCircle, LuCheck, LuRadar } from 'react-icons/lu';
import type { MIDIPortInfo } from '../types/midi.ts';

interface DevicePanelProps {
  inputs: MIDIPortInfo[];
  outputs: MIDIPortInfo[];
  monitoredInputs: Set<string>;
  selectedOutput: string | null;
  onToggleInput: (id: string) => void;
  onSelectOutput: (id: string) => void;
  onScanDevices: () => void;
}

interface InterfaceGroup {
  name: string;
  inputs: MIDIPortInfo[];
  outputs: MIDIPortInfo[];
}

const groupByInterface = (inputs: MIDIPortInfo[], outputs: MIDIPortInfo[]): InterfaceGroup[] => {
  const groups = new Map<string, InterfaceGroup>();

  const getGroupKey = (port: MIDIPortInfo): string => {
    if (port.manufacturer) return port.manufacturer;
    // Fall back to port name without trailing numbers/suffixes
    const name = port.name.replace(/\s*(port\s*)?\d+$/i, '').trim();
    return name || 'Unknown Interface';
  };

  for (const port of inputs) {
    const key = getGroupKey(port);
    if (!groups.has(key)) {
      groups.set(key, { name: key, inputs: [], outputs: [] });
    }
    groups.get(key)!.inputs.push(port);
  }

  for (const port of outputs) {
    const key = getGroupKey(port);
    if (!groups.has(key)) {
      groups.set(key, { name: key, inputs: [], outputs: [] });
    }
    groups.get(key)!.outputs.push(port);
  }

  return Array.from(groups.values());
};

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
  onScanDevices,
}: DevicePanelProps) => {
  const groups = groupByInterface(inputs, outputs);
  const totalPorts = inputs.length + outputs.length;

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Devices ({totalPorts})
        </h2>
        <button
          onClick={onScanDevices}
          title="Scan for MIDI devices"
          className="flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer
                     border border-border text-text-secondary
                     hover:bg-bg-hover hover:text-text-primary transition-colors"
        >
          <LuRadar className="w-3.5 h-3.5" />
          Scan
        </button>
      </div>

      {totalPorts === 0 ? (
        <p className="text-xs text-text-muted">No MIDI devices detected. Click Scan to search.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => (
            <div key={group.name}>
              <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-1.5 px-1">
                {group.name}
              </h3>
              <div className="flex flex-col gap-0.5">
                {group.inputs.map((port) => (
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
                    <span className="text-[10px] text-text-muted font-mono shrink-0">IN</span>
                    <span className="truncate">{port.name}</span>
                  </button>
                ))}
                {group.outputs.map((port) => (
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
                    <span className="w-3 h-3 shrink-0" />
                    <span className="text-[10px] text-text-muted font-mono shrink-0">OUT</span>
                    <span className="truncate">{port.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DevicePanel;
