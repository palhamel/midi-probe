import { useState } from 'react';
import { LuSend } from 'react-icons/lu';

interface ProgramChangeProps {
  onProgramChange: (program: number) => void;
}

const ProgramChange = ({ onProgramChange }: ProgramChangeProps) => {
  const [program, setProgram] = useState(0);

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
        Program Change
      </h3>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={0}
          max={127}
          value={program}
          onChange={(e) => setProgram(Math.min(127, Math.max(0, parseInt(e.target.value) || 0)))}
          className="w-16 text-xs font-mono text-center bg-bg-tertiary
                     border border-border rounded px-2 py-1.5 text-text-secondary
                     focus:outline-none focus:border-accent-blue"
        />
        <button
          onClick={() => onProgramChange(program)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded cursor-pointer
                     bg-accent-purple/10 text-accent-purple border border-accent-purple/30
                     hover:bg-accent-purple/20 transition-colors"
        >
          <LuSend className="w-3 h-3" />
          Send
        </button>
      </div>
    </div>
  );
};

export default ProgramChange;
