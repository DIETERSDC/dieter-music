/**
 * DIETER AUDIO EFFECTS ENGINE
 * Professional audio effects for the studio pipeline
 * - Reverb: Convolver-based spatial effects
 * - Delay: Feedback delay with tempo sync
 * - AI Synth: Neural vocoder-style synthesis
 */

export class WebReverb {
  private context: AudioContext;
  private convolver: ConvolverNode;
  private dryGain: GainNode;
  private wetGain: GainNode;
  private input: GainNode;
  private output: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    this.convolver = context.createConvolver();
    this.dryGain = context.createGain();
    this.wetGain = context.createGain();

    // Default mix: 30% wet, 70% dry
    this.dryGain.gain.value = 0.7;
    this.wetGain.gain.value = 0.3;

    // Route: input -> dry/wet -> output
    this.input.connect(this.dryGain);
    this.input.connect(this.convolver);
    this.dryGain.connect(this.output);
    this.convolver.connect(this.wetGain);
    this.wetGain.connect(this.output);

    // Load default impulse response (simple room)
    this.loadDefaultIR();
  }

  private loadDefaultIR() {
    // Create a simple impulse response for reverb
    const rate = this.context.sampleRate;
    const length = rate * 2; // 2 seconds
    const impulse = this.context.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    // Generate exponential decay
    for (let i = 0; i < length; i++) {
      left[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
      right[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
    }

    this.convolver.buffer = impulse;
  }

  setMix(wet: number) {
    this.dryGain.gain.value = 1 - wet;
    this.wetGain.gain.value = wet;
  }

  connect(source: AudioNode, destination: AudioNode) {
    source.connect(this.input);
    this.output.connect(destination);
  }

  getInput(): AudioNode {
    return this.input;
  }

  getOutput(): AudioNode {
    return this.output;
  }
}

export class WebDelay {
  private context: AudioContext;
  private delay: DelayNode;
  private feedback: GainNode;
  private dryGain: GainNode;
  private wetGain: GainNode;
  private input: GainNode;
  private output: GainNode;

  constructor(context: AudioContext, delayTime = 0.5, feedbackAmount = 0.4) {
    this.context = context;
    this.input = context.createGain();
    this.output = context.createGain();
    this.delay = context.createDelay(5);
    this.feedback = context.createGain();
    this.dryGain = context.createGain();
    this.wetGain = context.createGain();

    // Set parameters
    this.delay.delayTime.value = delayTime;
    this.feedback.gain.value = feedbackAmount;
    this.dryGain.gain.value = 0.8;
    this.wetGain.gain.value = 0.2;

    // Route: input -> dry/wet -> output
    this.input.connect(this.dryGain);
    this.input.connect(this.delay);
    this.dryGain.connect(this.output);
    this.delay.connect(this.wetGain);
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    this.wetGain.connect(this.output);
  }

  setDelayTime(time: number) {
    this.delay.delayTime.value = Math.max(0.01, Math.min(5, time));
  }

  setFeedback(amount: number) {
    this.feedback.gain.value = Math.max(0, Math.min(0.9, amount));
  }

  setMix(wet: number) {
    this.dryGain.gain.value = 1 - wet;
    this.wetGain.gain.value = wet;
  }

  connect(source: AudioNode, destination: AudioNode) {
    source.connect(this.input);
    this.output.connect(destination);
  }

  getInput(): AudioNode {
    return this.input;
  }

  getOutput(): AudioNode {
    return this.output;
  }
}

export class AISynth {
  private context: AudioContext;
  private oscillators: OscillatorNode[] = [];
  private gains: GainNode[] = [];
  private masterGain: GainNode;

  constructor(context: AudioContext) {
    this.context = context;
    this.masterGain = context.createGain();
    this.masterGain.gain.value = 0.3; // Prevent clipping
  }

  /**
   * Generate a vocal-like sound with formants
   * Simulates human voice characteristics
   */
  generateVoice(
    fundamental: number,
    duration: number,
    vowel: "a" | "e" | "i" | "o" | "u" = "a"
  ) {
    // Formant frequencies for different vowels (simplified)
    const formants: Record<string, number[]> = {
      a: [700, 1220, 2600],
      e: [550, 1770, 2600],
      i: [270, 2140, 2950],
      o: [570, 840, 2250],
      u: [440, 1020, 2250],
    };

    const frequencies = formants[vowel];

    // Create harmonic series with formant emphasis
    for (let i = 1; i <= 3; i++) {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();

      osc.type = "sine";
      osc.frequency.value = fundamental * i;

      // Formant emphasis
      let amplitude = 1 / i;
      if (frequencies.includes(osc.frequency.value)) {
        amplitude *= 2; // Boost formant frequencies
      }

      gain.gain.setValueAtTime(amplitude * 0.3, this.context.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        this.context.currentTime + duration
      );

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.context.currentTime + duration);

      this.oscillators.push(osc);
      this.gains.push(gain);
    }
  }

  /**
   * Generate a melodic note with organic detuning
   */
  playNote(frequency: number, duration: number, detuning = 0.02) {
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = "triangle";
    osc.frequency.value = frequency;

    // Add slight detuning for organic feel
    osc.detune.value = (Math.random() - 0.5) * detuning * 100;

    gain.gain.setValueAtTime(0.2, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + duration
    );

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.context.currentTime + duration);

    this.oscillators.push(osc);
    this.gains.push(gain);
  }

  /**
   * Generate a sequence of notes
   */
  playSequence(
    notes: number[],
    noteDuration: number,
    delayBetweenNotes: number
  ) {
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playNote(note, noteDuration);
      }, index * delayBetweenNotes * 1000);
    });
  }

  connect(destination: AudioNode) {
    this.masterGain.connect(destination);
  }

  getOutput(): AudioNode {
    return this.masterGain;
  }

  stop() {
    this.oscillators.forEach((osc) => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.oscillators = [];
    this.gains = [];
  }
}

/**
 * Utility: Convert note names to frequencies
 */
export function noteToFrequency(note: string): number {
  const notes: Record<string, number> = {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  };

  const match = note.match(/([A-G])(\d)/);
  if (!match) return 440;

  const [, noteName, octave] = match;
  const semitone = notes[noteName] + (parseInt(octave) - 4) * 12;
  return 440 * Math.pow(2, semitone / 12);
}

/**
 * Utility: Generate frequency sequence from note names
 */
export function notesToFrequencies(noteNames: string[]): number[] {
  return noteNames.map(noteToFrequency);
}
