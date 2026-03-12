import { useState, useCallback } from 'react';

interface KeyboardProps {
  onNoteOn: (note: number, velocity: number) => void;
  onNoteOff: (note: number) => void;
  octave: number;
  onOctaveChange: (octave: number) => void;
}

const WHITE_KEYS = [0, 2, 4, 5, 7, 9, 11];
const BLACK_KEYS = [1, 3, -1, 6, 8, 10, -1];
const BLACK_OFFSETS: Record<number, string> = {
  1: 'left-[calc(100%/14*1-6px)]',
  3: 'left-[calc(100%/14*3-6px)]',
  6: 'left-[calc(100%/14*7-6px)]',
  8: 'left-[calc(100%/14*9-6px)]',
  10: 'left-[calc(100%/14*11-6px)]',
};

const Keyboard = ({ onNoteOn, onNoteOff, octave, onOctaveChange }: KeyboardProps) => {
  const [activeNotes, setActiveNotes] = useState<Set<number>>(new Set());

  const baseNote = (octave + 1) * 12;

  const handleNoteOn = useCallback((note: number) => {
    setActiveNotes((prev) => new Set(prev).add(note));
    onNoteOn(note, 100);
  }, [onNoteOn]);

  const handleNoteOff = useCallback((note: number) => {
    setActiveNotes((prev) => {
      const next = new Set(prev);
      next.delete(note);
      return next;
    });
    onNoteOff(note);
  }, [onNoteOff]);

  const renderOctaveKeys = (octaveOffset: number) => {
    const base = baseNote + octaveOffset * 12;
    return (
      <div className="relative flex-1" key={octaveOffset}>
        <div className="flex h-full">
          {WHITE_KEYS.map((semitone) => {
            const note = base + semitone;
            const isActive = activeNotes.has(note);
            return (
              <button
                key={note}
                onPointerDown={() => handleNoteOn(note)}
                onPointerUp={() => handleNoteOff(note)}
                onPointerLeave={() => { if (activeNotes.has(note)) handleNoteOff(note); }}
                className={`flex-1 border-r border-border/50 cursor-pointer transition-colors
                  rounded-b select-none touch-none
                  ${isActive
                    ? 'bg-accent-blue/30 border-accent-blue/50'
                    : 'bg-bg-tertiary hover:bg-bg-hover'
                  }`}
              />
            );
          })}
        </div>
        <div className="absolute top-0 left-0 right-0 h-[58%] pointer-events-none">
          {BLACK_KEYS.filter(s => s >= 0).map((semitone) => {
            const note = base + semitone;
            const isActive = activeNotes.has(note);
            return (
              <button
                key={note}
                onPointerDown={() => handleNoteOn(note)}
                onPointerUp={() => handleNoteOff(note)}
                onPointerLeave={() => { if (activeNotes.has(note)) handleNoteOff(note); }}
                className={`absolute w-[12px] h-full cursor-pointer pointer-events-auto
                  rounded-b select-none touch-none z-10
                  ${BLACK_OFFSETS[semitone] || ''}
                  ${isActive
                    ? 'bg-accent-blue border border-accent-blue/50'
                    : 'bg-[#1a1d27] hover:bg-[#2d3245] border border-border/30'
                  }`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
          Keyboard
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onOctaveChange(Math.max(0, octave - 1))}
            className="px-2 py-0.5 text-xs rounded cursor-pointer bg-bg-tertiary
                       hover:bg-bg-hover transition-colors text-text-secondary"
          >
            -
          </button>
          <span className="text-xs font-mono text-text-secondary w-12 text-center">
            C{octave}-C{octave + 2}
          </span>
          <button
            onClick={() => onOctaveChange(Math.min(7, octave + 1))}
            className="px-2 py-0.5 text-xs rounded cursor-pointer bg-bg-tertiary
                       hover:bg-bg-hover transition-colors text-text-secondary"
          >
            +
          </button>
        </div>
      </div>
      <div className="flex h-24 rounded overflow-hidden border border-border">
        {renderOctaveKeys(0)}
        {renderOctaveKeys(1)}
      </div>
    </div>
  );
};

export default Keyboard;
