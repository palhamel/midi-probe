import { LuPlug, LuRadar, LuChrome, LuShieldCheck, LuCable } from 'react-icons/lu';

interface NoAccessScreenProps {
  isSupported: boolean;
  onRequestAccess: () => void;
}

const Step = ({ number, icon: Icon, title, children }: {
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex gap-3">
    <div className="flex items-center justify-center w-7 h-7 rounded-full
                    bg-bg-tertiary border border-border text-[10px] font-mono
                    text-text-muted shrink-0">
      {number}
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-xs font-medium text-text-secondary">{title}</span>
      </div>
      <div className="text-xs text-text-muted leading-relaxed">{children}</div>
    </div>
  </div>
);

const NoAccessScreen = ({ isSupported, onRequestAccess }: NoAccessScreenProps) => (
  <div className="flex-1 flex items-center justify-center p-6">
    <div className="max-w-sm flex flex-col items-center gap-6 text-center">
      <LuPlug className="w-10 h-10 text-text-muted" />

      {isSupported ? (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-text-secondary">
              MIDI Access Required
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              Your browser supports MIDI but permission has not been granted yet.
              Follow the steps below to get started.
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full text-left">
            <Step number={1} icon={LuCable} title="Connect a MIDI device">
              Plug in a MIDI controller, keyboard, or interface via USB.
            </Step>
            <Step number={2} icon={LuRadar} title="Click Scan to request access">
              Your browser will show a permission prompt. Click Allow.
            </Step>
            <Step number={3} icon={LuShieldCheck} title="If blocked, reset permissions">
              Click the lock icon in the address bar, find MIDI, and set it to Allow.
              Then reload the page.
            </Step>
          </div>

          <button
            onClick={onRequestAccess}
            className="flex items-center gap-2 px-4 py-2 rounded text-xs font-medium
                       cursor-pointer bg-accent-blue/10 text-accent-blue
                       border border-accent-blue/30 hover:bg-accent-blue/20
                       transition-colors"
          >
            <LuRadar className="w-3.5 h-3.5" />
            Scan for MIDI Devices
          </button>
        </>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-text-secondary">
              Browser Not Supported
            </h2>
            <p className="text-xs text-text-muted leading-relaxed">
              The Web MIDI API is not available in this browser.
              MIDI Probe requires a Chromium-based browser to access your MIDI devices.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full text-left">
            <div className="flex flex-col gap-2 p-3 bg-bg-tertiary rounded border border-border">
              <div className="flex items-center gap-1.5">
                <LuChrome className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-xs font-medium text-text-secondary">Supported Browsers</span>
              </div>
              <ul className="text-xs text-text-muted leading-relaxed list-none flex flex-col gap-1">
                <li>Chrome 43+</li>
                <li>Edge 79+</li>
                <li>Opera 30+</li>
              </ul>
            </div>
            <p className="text-[10px] text-text-muted text-center">
              Firefox and Safari do not support the Web MIDI API.
            </p>
          </div>
        </>
      )}
    </div>
  </div>
);

export default NoAccessScreen;
