import { useState, useCallback } from 'react';

interface CCSlidersProps {
  onCCChange: (cc: number, value: number) => void;
}

interface SliderConfig {
  cc: number;
  label: string;
  value: number;
}

const DEFAULT_SLIDERS: SliderConfig[] = [
  { cc: 1, label: 'Mod Wheel', value: 0 },
  { cc: 7, label: 'Volume', value: 100 },
  { cc: 10, label: 'Pan', value: 64 },
  { cc: 11, label: 'Expression', value: 127 },
  { cc: 74, label: 'Cutoff', value: 64 },
  { cc: 71, label: 'Resonance', value: 0 },
];

const CCSliders = ({ onCCChange }: CCSlidersProps) => {
  const [sliders, setSliders] = useState<SliderConfig[]>(DEFAULT_SLIDERS);

  const handleChange = useCallback((index: number, value: number) => {
    setSliders((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value };
      return next;
    });
    onCCChange(sliders[index].cc, value);
  }, [onCCChange, sliders]);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        CC Sliders
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {sliders.map((slider, index) => (
          <div key={slider.cc} className="flex flex-col gap-1 p-2 bg-bg-tertiary rounded">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-secondary truncate">{slider.label}</span>
              <span className="text-[10px] font-mono text-text-muted">CC{slider.cc}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={127}
                value={slider.value}
                onChange={(e) => handleChange(index, parseInt(e.target.value))}
                className="flex-1 h-1 accent-accent-blue cursor-pointer"
              />
              <input
                type="number"
                min={0}
                max={127}
                value={slider.value}
                onChange={(e) => handleChange(index, Math.min(127, Math.max(0, parseInt(e.target.value) || 0)))}
                className="w-10 text-[10px] font-mono text-center bg-bg-primary
                           border border-border rounded px-1 py-0.5 text-text-secondary
                           focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CCSliders;
