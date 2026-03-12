import { useState, useCallback, useEffect } from 'react';
import { useMIDI } from './hooks/useMIDI.ts';
import Header from './components/Header.tsx';
import DevicePanel from './components/DevicePanel.tsx';
import MessageLog from './components/MessageLog.tsx';
import FilterPanel from './components/FilterPanel.tsx';
import OutputPanel from './components/OutputPanel.tsx';
import ErrorBanner from './components/ErrorBanner.tsx';

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

  // Auto-select first output when outputs change
  const firstOutputId = outputs.length > 0 ? outputs[0].id : null;
  useEffect(() => {
    if (firstOutputId && !selectedOutput) {
      setSelectedOutput(firstOutputId);
    }
  }, [firstOutputId, selectedOutput]);

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
      />

      {error && <ErrorBanner message={error} />}

      {/* Mobile/Tablet tab bar - visible below lg */}
      <div className="flex border-b border-border bg-bg-secondary lg:hidden">
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
      <div className="flex-1 overflow-hidden lg:hidden">
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
          <div className="h-full overflow-y-auto bg-bg-secondary">
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
          <div className="h-full overflow-y-auto bg-bg-secondary">
            <OutputPanel
              selectedOutput={selectedOutput}
              outputName={selectedOutputName}
              sendMessage={sendMessage}
            />
          </div>
        )}
        {mobileTab === 'filter' && (
          <div className="h-full overflow-y-auto bg-bg-secondary">
            <FilterPanel filter={filter} onFilterChange={setFilter} />
          </div>
        )}
      </div>

      {/* Desktop 3-column layout - visible at lg and above */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Left sidebar - Devices */}
        <div className="w-52 shrink-0 border-r border-border bg-bg-secondary overflow-y-auto">
          <DevicePanel
            inputs={inputs}
            outputs={outputs}
            monitoredInputs={monitoredInputs}
            selectedOutput={selectedOutput}
            onToggleInput={toggleInput}
            onSelectOutput={setSelectedOutput}
          />
        </div>

        {/* Center - Message Log */}
        <div className="flex-1 flex flex-col min-w-0">
          <MessageLog
            messages={messages}
            paused={paused}
            onClear={clearMessages}
            onTogglePause={() => setPaused(!paused)}
          />
        </div>

        {/* Right sidebar - Output/Filter */}
        <div className="w-80 shrink-0 border-l border-border bg-bg-secondary flex flex-col overflow-hidden">
          <div className="flex border-b border-border">
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
    </div>
  );
};

export default App;
