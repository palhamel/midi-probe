import { useState, useEffect, useCallback, useRef } from 'react';
import type { MIDIPortInfo, ParsedMIDIMessage, MIDIFilter } from '../types/midi.ts';
import { parseMIDIMessage, messageTypeToFilterKey } from '../utils/midiParser.ts';
import { DEFAULT_FILTER } from '../types/midi.ts';

const MAX_MESSAGES = 2000;

interface UseMIDIReturn {
  isSupported: boolean;
  isConnected: boolean;
  error: string | null;
  inputs: MIDIPortInfo[];
  outputs: MIDIPortInfo[];
  messages: ParsedMIDIMessage[];
  filter: MIDIFilter;
  monitoredInputs: Set<string>;
  paused: boolean;
  messageRate: number;
  setFilter: (filter: MIDIFilter) => void;
  setMonitoredInputs: (inputs: Set<string>) => void;
  setPaused: (paused: boolean) => void;
  clearMessages: () => void;
  sendMessage: (outputId: string, data: number[]) => void;
  requestAccess: () => void;
}

export const useMIDI = (): UseMIDIReturn => {
  const [isSupported] = useState(() => 'requestMIDIAccess' in navigator);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inputs, setInputs] = useState<MIDIPortInfo[]>([]);
  const [outputs, setOutputs] = useState<MIDIPortInfo[]>([]);
  const [messages, setMessages] = useState<ParsedMIDIMessage[]>([]);
  const [filter, setFilter] = useState<MIDIFilter>(DEFAULT_FILTER);
  const [monitoredInputs, setMonitoredInputs] = useState<Set<string>>(new Set());
  const [paused, setPaused] = useState(false);
  const [messageRate, setMessageRate] = useState(0);

  const midiAccessRef = useRef<MIDIAccess | null>(null);
  const filterRef = useRef(filter);
  const monitoredRef = useRef(monitoredInputs);
  const pausedRef = useRef(paused);
  const rateCounterRef = useRef(0);
  const activityRef = useRef<Map<string, number>>(new Map());

  // Sync refs in effects (React 19 strict mode compliance)
  useEffect(() => { filterRef.current = filter; }, [filter]);
  useEffect(() => { monitoredRef.current = monitoredInputs; }, [monitoredInputs]);
  useEffect(() => { pausedRef.current = paused; }, [paused]);

  const updatePorts = useCallback((access: MIDIAccess) => {
    const newInputs: MIDIPortInfo[] = [];
    access.inputs.forEach((port) => {
      newInputs.push({
        id: port.id,
        name: port.name || 'Unknown',
        manufacturer: port.manufacturer || '',
        state: port.state,
        type: 'input',
        connection: port.connection,
        lastActivity: activityRef.current.get(port.id) ?? null,
      });
    });

    const newOutputs: MIDIPortInfo[] = [];
    access.outputs.forEach((port) => {
      newOutputs.push({
        id: port.id,
        name: port.name || 'Unknown',
        manufacturer: port.manufacturer || '',
        state: port.state,
        type: 'output',
        connection: port.connection,
        lastActivity: null,
      });
    });

    setInputs(newInputs);
    setOutputs(newOutputs);

    setMonitoredInputs((prev) => {
      if (prev.size === 0) {
        return new Set(newInputs.map(i => i.id));
      }
      return prev;
    });
  }, []);

  const handleMIDIMessage = useCallback((portId: string, portName: string, event: Event) => {
    const midiEvent = event as MIDIMessageEvent;
    if (!midiEvent.data || midiEvent.data.length === 0) return;

    if (!monitoredRef.current.has(portId)) return;

    const parsed = parseMIDIMessage(
      midiEvent.data,
      portId,
      portName,
      midiEvent.timeStamp || performance.now(),
    );

    const filterKey = messageTypeToFilterKey(parsed.type);
    if (filterKey !== 'unknown' && !filterRef.current[filterKey as keyof MIDIFilter]) return;
    if (parsed.channel !== null && !filterRef.current.channels.has(parsed.channel)) return;

    rateCounterRef.current++;

    activityRef.current.set(portId, Date.now());

    if (pausedRef.current) return;

    setMessages((prev) => {
      const next = [parsed, ...prev];
      if (next.length > MAX_MESSAGES) next.length = MAX_MESSAGES;
      return next;
    });
  }, []);

  const attachListeners = useCallback((access: MIDIAccess) => {
    access.inputs.forEach((input) => {
      input.onmidimessage = (event) => {
        handleMIDIMessage(input.id, input.name || 'Unknown', event as Event);
      };
    });
  }, [handleMIDIMessage]);

  const requestAccess = useCallback(async () => {
    if (!isSupported) {
      setError('Web MIDI API is not supported in this browser. Use Chrome, Edge, or Opera.');
      return;
    }

    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      midiAccessRef.current = access;
      setIsConnected(true);
      setError(null);

      updatePorts(access);
      attachListeners(access);

      access.onstatechange = () => {
        updatePorts(access);
        attachListeners(access);
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to access MIDI devices';
      setError(`MIDI access denied: ${message}`);
      setIsConnected(false);
    }
  }, [isSupported, updatePorts, attachListeners]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const sendMessage = useCallback((outputId: string, data: number[]) => {
    if (!midiAccessRef.current) return;
    const output = midiAccessRef.current.outputs.get(outputId);
    if (output) {
      output.send(data);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    if (isSupported) {
      requestAccess();
    }
  }, [isSupported, requestAccess]);

  // Message rate counter
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageRate(rateCounterRef.current);
      rateCounterRef.current = 0;
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
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
  };
};
