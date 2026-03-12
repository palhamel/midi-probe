import type { MIDIFilter } from '../types/midi.ts';

interface FilterPanelProps {
  filter: MIDIFilter;
  onFilterChange: (filter: MIDIFilter) => void;
}

const filterOptions: { key: keyof Omit<MIDIFilter, 'channels'>; label: string; color: string }[] = [
  { key: 'noteOn', label: 'Note On', color: 'bg-accent-green' },
  { key: 'noteOff', label: 'Note Off', color: 'bg-accent-red' },
  { key: 'controlChange', label: 'CC', color: 'bg-accent-blue' },
  { key: 'programChange', label: 'Program', color: 'bg-accent-purple' },
  { key: 'pitchBend', label: 'Pitch Bend', color: 'bg-accent-cyan' },
  { key: 'aftertouch', label: 'Aftertouch', color: 'bg-accent-yellow' },
  { key: 'channelPressure', label: 'Ch Press', color: 'bg-accent-yellow' },
  { key: 'sysex', label: 'SysEx', color: 'bg-accent-orange' },
  { key: 'clock', label: 'Clock', color: 'bg-text-muted' },
];

const FilterPanel = ({ filter, onFilterChange }: FilterPanelProps) => {
  const toggleFilter = (key: keyof Omit<MIDIFilter, 'channels'>) => {
    onFilterChange({ ...filter, [key]: !filter[key] });
  };

  const toggleChannel = (ch: number) => {
    const next = new Set(filter.channels);
    if (next.has(ch)) {
      next.delete(ch);
    } else {
      next.add(ch);
    }
    onFilterChange({ ...filter, channels: next });
  };

  const allChannels = filter.channels.size === 16;
  const toggleAllChannels = () => {
    if (allChannels) {
      onFilterChange({ ...filter, channels: new Set() });
    } else {
      onFilterChange({ ...filter, channels: new Set(Array.from({ length: 16 }, (_, i) => i + 1)) });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-3">
      <div>
        <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
          Message Types
        </h2>
        <div className="flex flex-col gap-1">
          {filterOptions.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleFilter(key)}
              className={`flex items-center gap-2 px-2 py-1 rounded text-xs cursor-pointer
                transition-colors text-left
                ${filter[key]
                  ? 'text-text-primary bg-bg-tertiary'
                  : 'text-text-muted line-through bg-transparent hover:bg-bg-tertiary/50'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${filter[key] ? color : 'bg-border'}`} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Channels
          </h2>
          <button
            onClick={toggleAllChannels}
            className="text-[10px] text-text-muted hover:text-text-secondary cursor-pointer"
          >
            {allChannels ? 'None' : 'All'}
          </button>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {Array.from({ length: 16 }, (_, i) => i + 1).map((ch) => (
            <button
              key={ch}
              onClick={() => toggleChannel(ch)}
              className={`text-[10px] py-1 rounded cursor-pointer transition-colors font-mono
                ${filter.channels.has(ch)
                  ? 'bg-bg-tertiary text-text-primary'
                  : 'text-text-muted hover:bg-bg-tertiary/50'
                }`}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
