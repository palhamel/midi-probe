import { useState, useCallback, useRef } from 'react';

interface PitchBendProps {
  onPitchBend: (value: number) => void;
}

const PitchBend = ({ onPitchBend }: PitchBendProps) => {
  const [value, setValue] = useState(8192);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateValue = useCallback((clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = 1 - (clientY - rect.top) / rect.height;
    const clamped = Math.max(0, Math.min(1, ratio));
    const bendValue = Math.round(clamped * 16383);
    setValue(bendValue);
    onPitchBend(bendValue);
  }, [onPitchBend]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateValue(e.clientY);
  }, [updateValue]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateValue(e.clientY);
  }, [updateValue]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    setValue(8192);
    onPitchBend(8192);
  }, [onPitchBend]);

  const percentage = (value / 16383) * 100;
  const displayValue = value - 8192;

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        Pitch Bend
      </h3>
      <div className="flex items-center gap-3">
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative w-8 h-32 bg-bg-tertiary rounded border border-border
                     cursor-pointer select-none touch-none"
        >
          <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
          <div
            className="absolute left-1 right-1 h-3 bg-accent-cyan rounded-sm transition-none"
            style={{ top: `calc(${100 - percentage}% - 6px)` }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono text-text-secondary">
            {displayValue > 0 ? `+${displayValue}` : displayValue}
          </span>
          <span className="text-[10px] text-text-muted">
            {displayValue === 0 ? 'Center' : displayValue > 0 ? 'Up' : 'Down'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PitchBend;
