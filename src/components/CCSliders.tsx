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

  const handleReset = useCallback((index: number) => {
    const defaultValue = DEFAULT_SLIDERS[index].value;
    setSliders((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], value: defaultValue };
      return next;
    });
    onCCChange(sliders[index].cc, defaultValue);
  }, [onCCChange, sliders]);

  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
        CC Sliders
      </h3>
      {sliders.map((slider, index) => (
        <div key={slider.cc} className="flex items-center gap-2 h-7">
          <button
            onClick={() => handleReset(index)}
            title={`Reset to ${DEFAULT_SLIDERS[index].value}`}
            className="text-[10px] text-text-secondary w-16 shrink-0 truncate text-left
                       cursor-pointer hover:text-accent-blue transition-colors"
          >
            {slider.label}
          </button>
          <input
            type="range"
            min={0}
            max={127}
            value={slider.value}
            onChange={(e) => handleChange(index, parseInt(e.target.value))}
            className="flex-1 h-1 accent-accent-blue cursor-pointer min-w-0"
          />
          <span className="text-[10px] font-mono text-text-muted w-6 text-right shrink-0">
            {slider.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CCSliders;
