import { useState, useCallback, useRef } from 'react';

interface PitchBendProps {
  onPitchBend: (value: number) => void;
}

const PitchBend = ({ onPitchBend }: PitchBendProps) => {
  const [value, setValue] = useState(8192);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateValue = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, ratio));
    const bendValue = Math.round(clamped * 16383);
    setValue(bendValue);
    onPitchBend(bendValue);
  }, [onPitchBend]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updateValue(e.clientX);
  }, [updateValue]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    updateValue(e.clientX);
  }, [updateValue]);

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    setValue(8192);
    onPitchBend(8192);
  }, [onPitchBend]);

  const percentage = (value / 16383) * 100;
  const displayValue = value - 8192;

  return (
    <div className="flex items-center gap-2 h-7">
      <span className="text-[10px] text-text-secondary w-16 shrink-0">Pitch Bend</span>
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative flex-1 h-5 bg-bg-tertiary rounded border border-border
                   cursor-pointer select-none touch-none min-w-0"
      >
        <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />
        <div
          className="absolute top-0.5 bottom-0.5 w-2.5 bg-accent-cyan rounded-sm transition-none"
          style={{ left: `calc(${percentage}% - 5px)` }}
        />
      </div>
      <span className="text-[10px] font-mono text-text-muted w-6 text-right shrink-0">
        {displayValue > 0 ? `+${displayValue}` : displayValue}
      </span>
    </div>
  );
};

export default PitchBend;
