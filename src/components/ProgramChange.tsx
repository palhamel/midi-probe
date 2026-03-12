import { useState } from 'react';
import { LuSend } from 'react-icons/lu';

interface ProgramChangeProps {
  onProgramChange: (program: number) => void;
}

const ProgramChange = ({ onProgramChange }: ProgramChangeProps) => {
  const [program, setProgram] = useState(0);

  return (
    <div className="flex items-center gap-2 h-7">
      <span className="text-[10px] text-text-secondary w-16 shrink-0">Program Ch</span>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={program}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (e.target.value === '') { setProgram(0); return; }
          if (!isNaN(val)) setProgram(Math.min(127, Math.max(0, val)));
        }}
        className="w-12 text-[10px] font-mono text-center bg-bg-tertiary
                   border border-border rounded px-1 py-1 text-text-secondary
                   focus:outline-none focus:border-accent-blue"
      />
      <button
        onClick={() => onProgramChange(program)}
        className="flex items-center gap-1 px-2 py-1 text-[10px] rounded cursor-pointer
                   bg-accent-purple/10 text-accent-purple border border-accent-purple/30
                   hover:bg-accent-purple/20 transition-colors"
      >
        <LuSend className="w-2.5 h-2.5" />
        Send
      </button>
    </div>
  );
};

export default ProgramChange;
