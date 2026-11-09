// Every sound is synthesised with Web Audio, so the game ships no audio files.

const MUTE_KEY = "sm-lobby-muted";
const MASTER_LEVEL = 0.8;

interface ToneOpts {
  t?: number;
  type?: OscillatorType;
  freq: number;
  freqEnd?: number;
  dur: number;
  peak: number;
  attack?: number;
}

interface NoiseOpts {
  t?: number;
  filter: BiquadFilterType;
  freq: number;
  freqEnd?: number;
  q?: number;
  dur: number;
  peak: number;
}

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private ambience: { stop: () => void } | null = null;
  private ambienceKind: "menu" | "lobby" | null = null;
  muted = readMuted();

  get unlocked() {
    return this.ctx?.state === "running";
  }

  /** Browsers only allow audio after a user gesture, so call this from a click or key handler. */
  unlock() {
    if (!this.ctx) {
      // Older Safari only ships the prefixed constructor.
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      const ctx: AudioContext = new AC();
      const master = ctx.createGain();
      master.gain.value = this.muted ? 0 : MASTER_LEVEL;
      // Full-auto bursts stack up; the compressor keeps them from clipping.
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -12;
      comp.ratio.value = 6;
      master.connect(comp).connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
      this.noise = makeNoise(ctx);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    try {
      localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
    } catch {
      // Storage blocked (private mode): the choice lasts for this visit only.
    }
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(muted ? 0 : MASTER_LEVEL, this.ctx.currentTime, 0.03);
    }
  }

  private get now() {
    return this.ctx ? this.ctx.currentTime : 0;
  }

  private tone({ t = this.now, type = "sine", freq, freqEnd, dur, peak, attack = 0.003 }: ToneOpts) {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (freqEnd) osc.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    const g = ctx.createGain();
    envelope(g, t, attack, peak, dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + attack + dur + 0.05);
  }

  private burst({ t = this.now, filter, freq, freqEnd, q = 1, dur, peak }: NoiseOpts) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.noise) return;
    const src = ctx.createBufferSource();
    src.buffer = this.noise;
    const f = ctx.createBiquadFilter();
    f.type = filter;
    f.frequency.setValueAtTime(freq, t);
    if (freqEnd) f.frequency.exponentialRampToValueAtTime(freqEnd, t + dur);
    f.Q.value = q;
    const g = ctx.createGain();
    envelope(g, t, 0.002, peak, dur);
    src.connect(f).connect(g).connect(this.master);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  /** `volume` < 1 for other players' shots, scaled by distance. */
  shoot(volume = 1) {
    const t = this.now;
    this.burst({ t, filter: "bandpass", freq: 2600, freqEnd: 600, q: 0.7, dur: 0.11, peak: 0.9 * volume });
    this.burst({ t, filter: "lowpass", freq: 1100, freqEnd: 200, dur: 0.24, peak: 0.55 * volume });
    this.tone({ t, freq: 160, freqEnd: 42, dur: 0.15, peak: 0.85 * volume });
    this.tone({ t, type: "square", freq: 1900, freqEnd: 500, dur: 0.025, peak: 0.06 * volume });
  }

  chatPing() {
    this.tone({ type: "triangle", freq: 1200, freqEnd: 1500, dur: 0.06, peak: 0.08 });
  }

  dryFire() {
    this.tone({ type: "square", freq: 2400, freqEnd: 1800, dur: 0.02, peak: 0.12 });
  }

  reload() {
    const t = this.now;
    // mag out
    this.burst({ t, filter: "highpass", freq: 2800, dur: 0.05, peak: 0.25 });
    this.tone({ t, type: "square", freq: 900, freqEnd: 420, dur: 0.04, peak: 0.07 });
    // mag in
    this.burst({ t: t + 0.85, filter: "bandpass", freq: 1400, q: 2, dur: 0.06, peak: 0.35 });
    this.tone({ t: t + 0.85, type: "square", freq: 620, freqEnd: 300, dur: 0.05, peak: 0.08 });
    // bolt
    this.tone({ t: t + 1.45, type: "square", freq: 1500, freqEnd: 900, dur: 0.03, peak: 0.1 });
    this.tone({ t: t + 1.56, type: "square", freq: 1100, freqEnd: 700, dur: 0.035, peak: 0.1 });
  }

  step() {
    this.burst({ filter: "lowpass", freq: 260 + Math.random() * 140, dur: 0.09, peak: 0.22 });
    this.tone({ freq: 75 + Math.random() * 15, freqEnd: 45, dur: 0.06, peak: 0.12 });
  }

  jump() {
    this.burst({ filter: "lowpass", freq: 520, dur: 0.08, peak: 0.12 });
  }

  land() {
    this.burst({ filter: "lowpass", freq: 340, dur: 0.14, peak: 0.35 });
    this.tone({ freq: 70, freqEnd: 38, dur: 0.1, peak: 0.22 });
  }

  hit() {
    this.tone({ type: "triangle", freq: 1650, freqEnd: 1450, dur: 0.07, peak: 0.22 });
  }

  headshot() {
    const t = this.now;
    this.tone({ t, freq: 2650, dur: 0.28, peak: 0.28 });
    this.tone({ t, type: "triangle", freq: 1325, dur: 0.22, peak: 0.16 });
  }

  kill() {
    const t = this.now;
    this.tone({ t, type: "triangle", freq: 880, dur: 0.1, peak: 0.2 });
    this.tone({ t: t + 0.07, type: "triangle", freq: 1320, dur: 0.2, peak: 0.2 });
  }

  impact() {
    this.burst({ filter: "highpass", freq: 3200, dur: 0.035, peak: 0.07 });
  }

  uiHover() {
    this.tone({ freq: 1900, dur: 0.03, peak: 0.04 });
  }

  uiClick() {
    this.tone({ type: "square", freq: 700, freqEnd: 1150, dur: 0.05, peak: 0.07 });
    this.burst({ filter: "highpass", freq: 4200, dur: 0.03, peak: 0.05 });
  }

  uiOpen() {
    this.burst({ filter: "bandpass", freq: 420, freqEnd: 3200, q: 1.4, dur: 0.24, peak: 0.2 });
    this.tone({ freq: 300, freqEnd: 640, dur: 0.18, peak: 0.08 });
  }

  uiClose() {
    this.burst({ filter: "bandpass", freq: 2800, freqEnd: 380, q: 1.4, dur: 0.2, peak: 0.16 });
  }

  matchFound() {
    const t = this.now;
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
      this.tone({ t: t + i * 0.09, freq: f, dur: 0.4, peak: 0.16 });
      this.tone({ t: t + i * 0.09, type: "triangle", freq: f / 2, dur: 0.3, peak: 0.06 });
    });
  }

  startAmbience(kind: "menu" | "lobby") {
    const ctx = this.ctx;
    if (!ctx || !this.master || this.ambienceKind === kind) return;
    this.stopAmbience();

    const roots = kind === "menu" ? [65.41, 98.0, 130.81] : [55.0, 55.35, 82.4];
    const out = ctx.createGain();
    out.gain.setValueAtTime(0.0001, ctx.currentTime);
    out.gain.exponentialRampToValueAtTime(kind === "menu" ? 0.05 : 0.04, ctx.currentTime + 2);
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = kind === "menu" ? 420 : 240;
    lp.Q.value = 3;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = kind === "menu" ? 220 : 110;
    lfo.connect(lfoDepth).connect(lp.frequency);
    lp.connect(out).connect(this.master);

    const oscs = roots.map((f) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(lp);
      o.start();
      return o;
    });
    lfo.start();

    this.ambienceKind = kind;
    this.ambience = {
      stop: () => {
        const t = ctx.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setTargetAtTime(0.0001, t, 0.3);
        [...oscs, lfo].forEach((o) => o.stop(t + 1.5));
      },
    };
  }

  stopAmbience() {
    this.ambience?.stop();
    this.ambience = null;
    this.ambienceKind = null;
  }
}

function envelope(g: GainNode, t: number, attack: number, peak: number, decay: number) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
}

function makeNoise(ctx: AudioContext) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function readMuted() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

export const sound = new SoundEngine();
