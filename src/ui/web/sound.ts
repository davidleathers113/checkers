/**
 * A tiny synthesized sound engine for the game — no audio files, just the Web
 * Audio API. Every entry point is guarded so it is a no-op where Web Audio is
 * unavailable (e.g. jsdom in tests) and respects a global mute flag.
 *
 * The AudioContext is created lazily on first use, which is always triggered by
 * a user gesture (a move), satisfying browser autoplay policies.
 */

type WindowWithAudio = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muted = false;

export function setSoundMuted(value: boolean): void {
  muted = value;
}

function audio(): { ctx: AudioContext; master: GainNode } | null {
  if (muted || typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as WindowWithAudio).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
  return master ? { ctx, master } : null;
}

interface ToneOpts {
  freq: number;
  dur: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  glideTo?: number;
}

function tone({ freq, dur, type = 'sine', gain = 0.2, delay = 0, glideTo }: ToneOpts): void {
  const a = audio();
  if (!a) return;
  const t0 = a.ctx.currentTime + delay;
  const osc = a.ctx.createOscillator();
  const g = a.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
  // quick attack, smooth exponential decay — feels percussive and soft
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(a.master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** A short filtered-noise burst for woody "clack" transients. */
function noise(dur: number, gain: number, delay = 0): void {
  const a = audio();
  if (!a) return;
  const t0 = a.ctx.currentTime + delay;
  const frames = Math.floor(a.ctx.sampleRate * dur);
  const buffer = a.ctx.createBuffer(1, frames, a.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames); // decaying noise
  }
  const src = a.ctx.createBufferSource();
  src.buffer = buffer;
  const filter = a.ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1600;
  const g = a.ctx.createGain();
  g.gain.value = gain;
  src.connect(filter);
  filter.connect(g);
  g.connect(a.master);
  src.start(t0);
}

/** Soft wooden "tock" when a piece is placed. */
export function playMove(): void {
  tone({ freq: 210, dur: 0.16, type: 'triangle', gain: 0.18 });
  tone({ freq: 140, dur: 0.12, type: 'sine', gain: 0.12 });
}

/** A sharper "clack" plus a low thump when a piece is captured. */
export function playCapture(): void {
  noise(0.09, 0.3);
  tone({ freq: 120, dur: 0.18, type: 'sine', gain: 0.22 });
  tone({ freq: 320, dur: 0.1, type: 'triangle', gain: 0.12 });
}

/** A bright rising chime when a piece is crowned. */
export function playPromote(): void {
  tone({ freq: 523.25, dur: 0.18, type: 'sine', gain: 0.16 }); // C5
  tone({ freq: 659.25, dur: 0.18, type: 'sine', gain: 0.16, delay: 0.09 }); // E5
  tone({ freq: 783.99, dur: 0.28, type: 'sine', gain: 0.18, delay: 0.18 }); // G5
}

/** A short triumphant arpeggio when the game is won. */
export function playWin(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => tone({ freq: f, dur: 0.34, type: 'triangle', gain: 0.18, delay: i * 0.11 }));
}

/** A subtle tick when a piece is picked up. */
export function playPickup(): void {
  tone({ freq: 440, dur: 0.05, type: 'sine', gain: 0.08 });
}

/** Light haptic feedback on supporting (touch) devices. */
export function vibrate(pattern: number | number[]): void {
  if (muted || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}
