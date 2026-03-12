import { useState, useCallback, useEffect } from 'react';
import { useMIDI } from './hooks/useMIDI.ts';
import Header from './components/Header.tsx';
import DevicePanel from './components/DevicePanel.tsx';
import MessageLog from './components/MessageLog.tsx';
import FilterPanel from './components/FilterPanel.tsx';
import OutputPanel from './components/OutputPanel.tsx';
import ErrorBanner from './components/ErrorBanner.tsx';
import HelpModal from './components/HelpModal.tsx';
import NoAccessScreen from './components/NoAccessScreen.tsx';

type RightPanel = 'output' | 'filter';
type MobileTab = 'monitor' | 'devices' | 'output' | 'filter';

const App = () => {
  const {
    isSupported,
    isConnected,
    error,
    inputs,
    outputs,
    messages,
    filter,
    monitoredInputs,
    paused,
    messageRate,
    setFilter,
    setMonitoredInputs,
    setPaused,
    clearMessages,
    sendMessage,
    requestAccess,
  } = useMIDI();

  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);
  const [rightPanel, setRightPanel] = useState<RightPanel>('output');
  const [mobileTab, setMobileTab] = useState<MobileTab>('monitor');
  const [showHelp, setShowHelp] = useState(false);

  // Keep output selection valid as devices connect/disconnect
  useEffect(() => {
    if (outputs.length === 0) {
      if (selectedOutput !== null) {
        setSelectedOutput(null);
      }
      return;
    }

    if (!selectedOutput) {
      setSelectedOutput(outputs[0].id);
      return;
    }

    const stillExists = outputs.some((output) => output.id === selectedOutput);
    if (!stillExists) {
      setSelectedOutput(outputs[0].id);
    }
  }, [outputs, selectedOutput]);

  const toggleInput = useCallback((id: string) => {
    const next = new Set(monitoredInputs);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setMonitoredInputs(next);
  }, [monitoredInputs, setMonitoredInputs]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setPaused(!paused);
      } else if (e.code === 'KeyC' && !e.metaKey && !e.ctrlKey) {
        clearMessages();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [paused, setPaused, clearMessages]);

  const selectedOutputName = outputs.find(o => o.id === selectedOutput)?.name || '';

  const mobileTabClasses = (tab: MobileTab) =>
    `flex-1 py-2.5 text-xs font-medium cursor-pointer transition-colors text-center
     ${mobileTab === tab
       ? 'text-accent-blue border-b-2 border-accent-blue bg-bg-tertiary/50'
       : 'text-text-muted hover:text-text-secondary'
     }`;

  return (
    <div className="flex flex-col h-screen">
      <Header
        isConnected={isConnected}
        isSupported={isSupported}
        messageRate={messageRate}
        onOpenHelp={() => setShowHelp(true)}
      />

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {error && <ErrorBanner message={error} />}

      {!isConnected ? (
        <NoAccessScreen isSupported={isSupported} onRequestAccess={requestAccess} />
      ) : (
        <>
          {/* Mobile/Tablet tab bar - visible below lg */}
          <div className="lg:hidden flex bg-bg-secondary border-border border-b">
            <button onClick={() => setMobileTab('monitor')} className={mobileTabClasses('monitor')}>
              Monitor
            </button>
            <button onClick={() => setMobileTab('devices')} className={mobileTabClasses('devices')}>
              Devices
            </button>
            <button onClick={() => setMobileTab('output')} className={mobileTabClasses('output')}>
              Output
            </button>
            <button onClick={() => setMobileTab('filter')} className={mobileTabClasses('filter')}>
              Filters
            </button>
          </div>

          {/* Mobile/Tablet content - visible below lg */}
          <div className="lg:hidden flex-1 overflow-hidden">
            {mobileTab === 'monitor' && (
              <div className="flex flex-col h-full">
                <MessageLog
                  messages={messages}
                  paused={paused}
                  onClear={clearMessages}
                  onTogglePause={() => setPaused(!paused)}
                />
              </div>
            )}
            {mobileTab === 'devices' && (
              <div className="bg-bg-secondary h-full overflow-y-auto">
                <DevicePanel
                  inputs={inputs}
                  outputs={outputs}
                  monitoredInputs={monitoredInputs}
                  selectedOutput={selectedOutput}
                  onToggleInput={toggleInput}
                  onSelectOutput={setSelectedOutput}
                  onScanDevices={requestAccess}
                />
              </div>
            )}
            {mobileTab === 'output' && (
              <div className="bg-bg-secondary h-full overflow-y-auto">
                <OutputPanel
                  selectedOutput={selectedOutput}
                  outputName={selectedOutputName}
                  sendMessage={sendMessage}
                />
              </div>
            )}
            {mobileTab === 'filter' && (
              <div className="bg-bg-secondary h-full overflow-y-auto">
                <FilterPanel filter={filter} onFilterChange={setFilter} />
              </div>
            )}
          </div>

          {/* Desktop 3-column layout - visible at lg and above */}
          <div className="hidden lg:flex flex-1 overflow-hidden">
            {/* Left sidebar - Devices */}
            <div className="bg-bg-secondary border-border border-r w-52 overflow-y-auto shrink-0">
              <DevicePanel
                inputs={inputs}
                outputs={outputs}
                monitoredInputs={monitoredInputs}
                selectedOutput={selectedOutput}
                onToggleInput={toggleInput}
                onSelectOutput={setSelectedOutput}
                onScanDevices={requestAccess}
              />
            </div>

            {/* Center - Message Log */}
            <div className="flex flex-col flex-1 min-w-0">
              <MessageLog
                messages={messages}
                paused={paused}
                onClear={clearMessages}
                onTogglePause={() => setPaused(!paused)}
              />
            </div>

            {/* Right sidebar - Output/Filter */}
            <div className="flex flex-col bg-bg-secondary border-border border-l w-80 overflow-hidden shrink-0">
              <div className="flex border-border border-b">
                <button
                  onClick={() => setRightPanel('output')}
                  className={`flex-1 px-3 py-2 text-xs font-medium cursor-pointer transition-colors
                    ${rightPanel === 'output'
                      ? 'text-accent-purple border-b-2 border-accent-purple bg-bg-tertiary/50'
                      : 'text-text-muted hover:text-text-secondary'
                    }`}
                >
                  Output
                </button>
                <button
                  onClick={() => setRightPanel('filter')}
                  className={`flex-1 px-3 py-2 text-xs font-medium cursor-pointer transition-colors
                    ${rightPanel === 'filter'
                      ? 'text-accent-blue border-b-2 border-accent-blue bg-bg-tertiary/50'
                      : 'text-text-muted hover:text-text-secondary'
                    }`}
                >
                  Filters
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {rightPanel === 'output' ? (
                  <OutputPanel
                    selectedOutput={selectedOutput}
                    outputName={selectedOutputName}
                    sendMessage={sendMessage}
                  />
                ) : (
                  <FilterPanel filter={filter} onFilterChange={setFilter} />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
