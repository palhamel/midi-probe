import { LuX } from 'react-icons/lu';

interface HelpModalProps {
  onClose: () => void;
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <h3 className="font-semibold text-text-secondary text-xs uppercase tracking-wider">{title}</h3>
    <div className="text-text-secondary text-xs leading-relaxed">{children}</div>
  </div>
);

const Key = ({ children }: { children: React.ReactNode }) => (
  <kbd className="inline-block bg-bg-tertiary px-1.5 py-0.5 border border-border rounded font-mono text-[10px] text-text-secondary">{children}</kbd>
);

const HelpModal = ({ onClose }: HelpModalProps) => (
  <div
    className="z-50 fixed inset-0 flex justify-center items-center bg-black/60"
    onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
  >
    <div className="flex flex-col bg-bg-primary shadow-xl mx-4 border border-border rounded-lg w-full max-w-lg max-h-[85vh]">
      <div className="flex justify-between items-center px-4 py-3 border-border border-b">
        <h2 className="font-semibold text-sm">MIDI Probe Guide</h2>
        <button
          onClick={onClose}
          className="hover:bg-bg-hover p-1 rounded transition-colors cursor-pointer"
        >
          <LuX className="w-4 h-4 text-text-muted" />
        </button>
      </div>

      <div className="flex flex-col flex-1 gap-4 px-4 py-4 overflow-y-auto">
        <Section title="Device Panel">
          <p>
            MIDI ports are grouped by interface or manufacturer. Each port is labeled
            <strong> IN</strong> (input) or <strong>OUT</strong> (output).
          </p>
          <p className="mt-1">
            Click an input port to toggle monitoring — active inputs show a blue highlight
            and a green dot flashes on incoming data. Click an output port to select it
            as the target for the output panel.
          </p>
          <p className="mt-1">
            Use the <strong>Scan</strong> button to re-request MIDI access and detect
            newly connected devices.
          </p>
        </Section>

        <Section title="Message Log">
          <p>
            All incoming and outgoing MIDI messages appear here in real time, newest on top.
            The top row is subtly highlighted to show the latest message.
          </p>
          <p className="mt-1">
            Each row shows timestamp, port, channel, message type (color-coded),
            detail, and raw hex bytes. The log holds up to 2000 messages — older
            entries are automatically discarded.
          </p>
        </Section>

        <Section title="Keyboard">
          <p>
            A virtual 2-octave keyboard that sends Note On/Off to the selected output.
            Hover over a key to see the note name and MIDI number.
            Use the <strong>-</strong> / <strong>+</strong> buttons to shift octaves.
          </p>
          <p className="mt-1">
            Channel and velocity can be set in the output panel header.
          </p>
        </Section>

        <Section title="CC Sliders">
          <p>
            Six Control Change sliders: Mod Wheel, Volume, Pan, Expression, Cutoff,
            and Resonance. Drag to send CC values (0–127).
          </p>
          <p className="mt-1">
            Click a slider label to reset it to its default value.
          </p>
        </Section>

        <Section title="Pitch Bend">
          <p>
            A horizontal pitch bend slider. Drag left or right to bend.
            Releases automatically back to center (spring-loaded), just like
            a real pitch wheel.
          </p>
        </Section>

        <Section title="Program Change">
          <p>
            Type a program number (0–127) and click <strong>Send</strong> to
            send a Program Change message to the selected output.
          </p>
        </Section>

        <Section title="Filters">
          <p>
            Toggle which message types appear in the log (Note On, CC, etc.)
            and filter by MIDI channel (1–16). Filters apply to both incoming
            and outgoing messages.
          </p>
        </Section>

        <Section title="Export">
          <p>
            Use the export button in the message log toolbar to download the
            current log as CSV or JSON.
          </p>
        </Section>

        <Section title="Keyboard Shortcuts">
          <p className="flex flex-col gap-1">
            <span><Key>Space</Key> Pause / resume the message log</span>
            <span><Key>C</Key> Clear all messages</span>
          </p>
        </Section>

        <Section title="Browser Support">
          <p>
            MIDI Probe uses the Web MIDI API, available in Chromium-based browsers:
            Chrome, Edge, and Opera. Firefox and Safari are not supported.
          </p>
        </Section>

        <div className="my-2 border-border border-t" />

        <Section title="What is MIDI?">
          <p>
            MIDI (Musical Instrument Digital Interface) is a technical standard for
            communication between electronic musical instruments, computers, and
            audio devices. Unlike audio, MIDI doesn't transmit sound — it transmits
            performance data: which notes are played, how hard, which knobs are turned,
            and when.
          </p>
          <p className="mt-1">
            A MIDI message is typically 1–3 bytes. The first byte (status byte) defines
            the message type and channel. Common messages include Note On/Off (triggering
            sounds), Control Change (knobs, sliders, pedals), Program Change (selecting
            patches), and Pitch Bend.
          </p>
          <p className="mt-1">
            MIDI uses 16 channels per port, allowing multiple instruments or parts
            on a single connection. Values range from 0–127 (7 bits), except pitch bend
            which uses 14 bits (0–16383) for finer resolution.
          </p>
        </Section>

        <Section title="History of MIDI">
          <p>
            MIDI was born in 1981 when <a href="https://en.wikipedia.org/wiki/Dave_Smith_(engineer)" target="_blank" rel="noopener noreferrer" className="hover:underline text-accent-blue" aria-label="Learn more about Dave Smith on Wikipedia">Dave Smith</a> of Sequential Circuits proposed a
            Universal Synthesizer Interface at the Audio Engineering Society convention.
            With collaboration from Japanese manufacturers — Roland, Yamaha, Korg, and
            Kawai — the MIDI 1.0 specification was published in August 1983.
          </p>
          <p className="mt-1">
            The first MIDI connection was demonstrated in January 1983 between a
            <a
              href="https://www.vintagesynth.com/sequential-circuits/prophet-600"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent-blue"
              aria-label="Learn more about Sequential Circuits Prophet-600"
            >
              {' '}
              Sequential Circuits Prophet-600
            </a>{' '}
            and a{' '}
            <a
              href="https://en.wikipedia.org/wiki/Roland_Jupiter-6"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-accent-blue"
              aria-label="Learn more about Roland Jupiter-6"
            >
              Roland Jupiter-6
            </a>
            . For the first time, synthesizers from different manufacturers could
            talk to each other.
          </p>
          <p className="mt-1">
            MIDI 1.0 ran at 31.25 kbit/s over a 5-pin DIN connector. Despite its age,
            this specification remained essentially unchanged for nearly 40 years and
            became one of the most enduring standards in music technology.
          </p>
          <p className="mt-1">
            In 2020, the MIDI Manufacturers Association released MIDI 2.0, adding
            higher resolution (32-bit values), bidirectional communication, and
            per-note control. USB and network transports have largely replaced
            the original DIN connector, and the Web MIDI API (used by this tool)
            brings MIDI directly into the browser.
          </p>
        </Section>

        <div className="mt-2 pt-3 border-border border-t text-center">
          <span className="text-[10px] text-text-muted">
            Made by <a href="https://coderebel.se/" target="_blank" rel="noopener noreferrer" className="hover:underline text-accent-blue">Code Rebel</a>
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default HelpModal;
