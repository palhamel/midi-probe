import { useRef, useEffect } from 'react';
import { LuTrash2, LuPause, LuPlay, LuDownload } from 'react-icons/lu';
import type { ParsedMIDIMessage } from '../types/midi.ts';
import { getTypeColor, getTypeBgColor } from '../utils/midiParser.ts';
import { exportAsCSV, exportAsJSON } from '../utils/export.ts';

interface MessageLogProps {
  messages: ParsedMIDIMessage[];
  paused: boolean;
  onClear: () => void;
  onTogglePause: () => void;
}

const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  const s = date.getSeconds().toString().padStart(2, '0');
  const ms = date.getMilliseconds().toString().padStart(3, '0');
  return `${h}:${m}:${s}.${ms}`;
};

const MessageRow = ({ msg }: { msg: ParsedMIDIMessage }) => (
  <div
    className={`flex items-center gap-2 px-3 py-1 text-xs font-mono
      border-b border-border/30 hover:bg-bg-hover/50 min-w-[500px]
      sm:gap-3 ${getTypeBgColor(msg.type)}`}
  >
    <span className="text-text-muted w-16 shrink-0 sm:w-20">{formatTime(msg.timestamp)}</span>
    <span className="text-text-secondary w-20 shrink-0 truncate hidden sm:block">{msg.portName}</span>
    <span className="text-text-muted w-6 shrink-0 text-center sm:w-8">
      {msg.channel ?? '-'}
    </span>
    <span className={`w-28 shrink-0 font-medium sm:w-32 ${getTypeColor(msg.type)}`}>
      {msg.label}
    </span>
    <span className="text-text-secondary truncate">{msg.detail}</span>
    <span className="text-text-muted ml-auto shrink-0 hidden md:block">
      {Array.from(msg.data).map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
    </span>
  </div>
);

const MessageLog = ({ messages, paused, onClear, onTogglePause }: MessageLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paused && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [messages, paused]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg-secondary">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
            Message Log
          </h2>
          <span className="text-xs text-text-muted font-mono">
            ({messages.length})
          </span>
          {paused && (
            <span className="text-xs text-accent-yellow px-1.5 py-0.5 bg-accent-yellow/10 rounded">
              Paused
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePause}
            className="p-1.5 rounded cursor-pointer hover:bg-bg-hover transition-colors"
            title={paused ? 'Resume (Space)' : 'Pause (Space)'}
          >
            {paused ? (
              <LuPlay className="w-3.5 h-3.5 text-accent-green" />
            ) : (
              <LuPause className="w-3.5 h-3.5 text-text-secondary" />
            )}
          </button>
          <button
            onClick={onClear}
            className="p-1.5 rounded cursor-pointer hover:bg-bg-hover transition-colors"
            title="Clear log (C)"
          >
            <LuTrash2 className="w-3.5 h-3.5 text-text-secondary" />
          </button>
          <div className="relative group">
            <button
              className="p-1.5 rounded cursor-pointer hover:bg-bg-hover transition-colors"
              title="Export"
            >
              <LuDownload className="w-3.5 h-3.5 text-text-secondary" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-bg-secondary border border-border
                            rounded shadow-lg z-10 hidden group-hover:flex flex-col min-w-28">
              <button
                onClick={() => exportAsCSV(messages)}
                className="px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover
                           cursor-pointer text-left transition-colors"
              >
                Export CSV
              </button>
              <button
                onClick={() => exportAsJSON(messages)}
                className="px-3 py-1.5 text-xs text-text-secondary hover:bg-bg-hover
                           cursor-pointer text-left transition-colors"
              >
                Export JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-1 text-[10px] font-mono text-text-muted
                       uppercase tracking-wider border-b border-border bg-bg-tertiary
                       min-w-[500px] sm:gap-3">
        <span className="w-16 shrink-0 sm:w-20">Time</span>
        <span className="w-20 shrink-0 hidden sm:block">Port</span>
        <span className="w-6 shrink-0 text-center sm:w-8">Ch</span>
        <span className="w-28 shrink-0 sm:w-32">Message</span>
        <span className="truncate">Detail</span>
        <span className="ml-auto shrink-0 hidden md:block">Raw</span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted text-sm">
            Waiting for MIDI messages...
          </div>
        ) : (
          messages.map((msg) => <MessageRow key={msg.id} msg={msg} />)
        )}
      </div>
    </div>
  );
};

export default MessageLog;
