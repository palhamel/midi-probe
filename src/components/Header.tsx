import { LuActivity, LuPlug, LuPlugZap, LuCircleHelp } from 'react-icons/lu';

interface HeaderProps {
  isConnected: boolean;
  isSupported: boolean;
  messageRate: number;
  onOpenHelp: () => void;
}

const Header = ({ isConnected, isSupported, messageRate, onOpenHelp }: HeaderProps) => (
  <header className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border">
    <div className="flex items-center gap-3">
      <h1 className="text-lg font-semibold tracking-tight">MIDI Probe</h1>
      <span className="text-xs text-text-muted font-mono">v1.0.0</span>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden xl:flex items-center gap-2 text-[10px] text-text-muted">
        <span className="uppercase tracking-wider">Shortcuts</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-block px-1.5 py-0.5 font-mono bg-bg-tertiary border border-border rounded text-text-secondary">
            Space
          </kbd>
          <span>Pause/resume</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <kbd className="inline-block px-1.5 py-0.5 font-mono bg-bg-tertiary border border-border rounded text-text-secondary">
            C
          </kbd>
          <span>Clear</span>
        </span>
      </div>
      {messageRate > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-text-secondary font-mono">
          <LuActivity className="w-3.5 h-3.5 text-accent-green" />
          {messageRate} msg/s
        </div>
      )}
      <div
        title={isConnected
          ? 'Browser has MIDI access granted.'
          : isSupported
            ? 'MIDI access not granted. Use Scan Devices to request permission.'
            : 'Your browser does not support the Web MIDI API. Use Chrome, Edge, or Opera.'}
        className="flex items-center gap-1.5 text-xs px-2 py-1 rounded border border-border"
      >
        {isConnected ? (
          <>
            <LuPlugZap className="w-3.5 h-3.5 text-accent-green" />
            <span className="text-accent-green">MIDI Access</span>
          </>
        ) : (
          <>
            <LuPlug className="w-3.5 h-3.5 text-accent-red" />
            <span className="text-accent-red">
              {isSupported ? 'No MIDI Access' : 'Not Supported'}
            </span>
          </>
        )}
      </div>
      <button
        onClick={onOpenHelp}
        title="About MIDI Probe"
        className="flex items-center gap-1 px-2 py-1 rounded text-xs cursor-pointer
                   text-text-muted border border-border
                   hover:bg-bg-hover hover:text-text-secondary transition-colors"
      >
        <LuCircleHelp className="w-3.5 h-3.5" />
        About
      </button>
    </div>
  </header>
);

export default Header;
