import { LuActivity, LuPlug, LuPlugZap } from 'react-icons/lu';

interface HeaderProps {
  isConnected: boolean;
  isSupported: boolean;
  messageRate: number;
}

const Header = ({ isConnected, isSupported, messageRate }: HeaderProps) => (
  <header className="flex items-center justify-between px-4 py-3 bg-bg-secondary border-b border-border">
    <div className="flex items-center gap-3">
      <h1 className="text-lg font-semibold tracking-tight">MIDI Probe</h1>
      <span className="text-xs text-text-muted font-mono">v1.0.0</span>
    </div>
    <div className="flex items-center gap-4">
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
    </div>
  </header>
);

export default Header;
