import {
  setSoundMuted,
  playMove,
  playCapture,
  playPromote,
  playWin,
  playPickup,
  vibrate
} from '../../src/ui/web/sound';

/** Minimal Web Audio stubs so the synthesis code paths actually run in jsdom. */
class FakeParam {
  setValueAtTime(): void {}
  exponentialRampToValueAtTime(): void {}
}
class FakeNode {
  connect(): void {}
}
class FakeGain extends FakeNode {
  gain = new FakeParam();
}
class FakeOsc extends FakeNode {
  type = 'sine';
  frequency = new FakeParam();
  start = jest.fn();
  stop = jest.fn();
}
class FakeBufferSource extends FakeNode {
  buffer: unknown = null;
  start = jest.fn();
}
class FakeFilter extends FakeNode {
  type = 'bandpass';
  frequency = { value: 0 };
}

const createOscillator = jest.fn(() => new FakeOsc());

class FakeAudioContext {
  static ctorCount = 0;
  currentTime = 0;
  sampleRate = 44100;
  destination = {};
  state: AudioContextState = 'running';
  constructor() {
    FakeAudioContext.ctorCount++;
  }
  createGain = (): FakeGain => new FakeGain();
  createOscillator = createOscillator;
  createBuffer = (_c: number, frames: number): { getChannelData: () => Float32Array } => ({
    getChannelData: () => new Float32Array(frames)
  });
  createBufferSource = (): FakeBufferSource => new FakeBufferSource();
  createBiquadFilter = (): FakeFilter => new FakeFilter();
  resume = jest.fn();
}

describe('sound engine', () => {
  afterEach(() => {
    setSoundMuted(false);
    createOscillator.mockClear();
  });

  it('is a no-op when no AudioContext is available (must run before one is created)', () => {
    const win = window as unknown as { AudioContext?: unknown; webkitAudioContext?: unknown };
    const saved = win.AudioContext;
    delete win.AudioContext;
    delete win.webkitAudioContext;
    setSoundMuted(false);
    expect(() => {
      playMove();
      playCapture();
    }).not.toThrow();
    expect(createOscillator).not.toHaveBeenCalled();
    win.AudioContext = saved;
  });

  it('synthesizes every cue without throwing when audio is available', () => {
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
    setSoundMuted(false);
    expect(() => {
      playMove();
      playCapture();
      playPromote();
      playWin();
      playPickup();
    }).not.toThrow();
    expect(createOscillator).toHaveBeenCalled();
  });

  it('stays silent when muted', () => {
    (window as unknown as { AudioContext: unknown }).AudioContext = FakeAudioContext;
    setSoundMuted(true);
    playMove();
    playCapture();
    expect(createOscillator).not.toHaveBeenCalled();
  });

  it('triggers haptics only when unmuted and supported', () => {
    const vib = jest.fn();
    Object.defineProperty(navigator, 'vibrate', { value: vib, configurable: true });

    setSoundMuted(false);
    vibrate([10, 20]);
    expect(vib).toHaveBeenCalledWith([10, 20]);

    vib.mockClear();
    setSoundMuted(true);
    vibrate(10);
    expect(vib).not.toHaveBeenCalled();
  });
});
