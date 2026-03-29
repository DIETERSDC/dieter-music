import * as Tone from "tone";

export interface ChannelGains {
  vocals: Tone.Gain;
  harmony: Tone.Gain;
  kick: Tone.Gain;
  snare: Tone.Gain;
  hihat: Tone.Gain;
  bass: Tone.Gain;
  chords: Tone.Gain;
  fx: Tone.Gain;
}

export class MusicSynthesizer {
  private master: Tone.Gain;
  private analyser: Tone.Analyser;
  private beatAnalyser: Tone.Analyser;
  private channelGains: ChannelGains;
  private synths: { [key: string]: Tone.Synth } = {};
  private drums: { [key: string]: Tone.Synth } = {};
  private isPlaying = false;

  constructor() {
    // Initialize Tone.js
    this.master = new Tone.Gain(0.8).toDestination();

    // Analyser for waveform visualization
    this.analyser = new Tone.Analyser("waveform");
    this.master.connect(this.analyser);

    // Initialize beat detection analyser
    this.beatAnalyser = new Tone.Analyser("fft", 512);
    this.master.connect(this.beatAnalyser);

    // Initialize channel gains
    this.channelGains = {
      vocals: new Tone.Gain(0.8),
      harmony: new Tone.Gain(0.6),
      kick: new Tone.Gain(0.9),
      snare: new Tone.Gain(0.8),
      hihat: new Tone.Gain(0.5),
      bass: new Tone.Gain(0.7),
      chords: new Tone.Gain(0.6),
      fx: new Tone.Gain(0.4),
    };

    // Connect all channels to master
    Object.values(this.channelGains).forEach((gain) => {
      gain.connect(this.master);
    });

    // Initialize synths
    this.synths.vocals = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
    }).connect(this.channelGains.vocals);

    this.synths.bass = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.5 },
    }).connect(this.channelGains.bass);

    const chordSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 0.5 },
    });
    (chordSynth as any).connect(this.channelGains.chords);
    this.synths.chords = chordSynth as any;

    // Initialize drum synths
    this.drums.kick = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
    }).connect(this.channelGains.kick);

    this.drums.snare = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.05 },
    }).connect(this.channelGains.snare);

    this.drums.hihat = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.01 },
    }).connect(this.channelGains.hihat);
  }

  async start() {
    await Tone.start();
    this.isPlaying = true;
  }

  stop() {
    Tone.Transport.stop();
    this.isPlaying = false;
  }

  setChannelVolume(channel: keyof ChannelGains, volume: number) {
    this.channelGains[channel].gain.value = Math.max(0, Math.min(1, volume));
  }

  getChannelVolume(channel: keyof ChannelGains): number {
    return this.channelGains[channel].gain.value;
  }

  getWaveform(): any {
    return this.analyser.getValue();
  }

  getFrequencies(): Uint8Array {
    return this.beatAnalyser.getValue() as Uint8Array;
  }

  playNote(
    note: string,
    duration: string = "8n",
    channel: "vocals" | "bass" | "chords" = "vocals"
  ) {
    if (channel === "chords" && this.synths.chords) {
      (this.synths.chords as Tone.PolySynth).triggerAttackRelease(
        note,
        duration
      );
    } else if (this.synths[channel]) {
      this.synths[channel].triggerAttackRelease(note, duration);
    }
  }

  playDrumSound(drum: "kick" | "snare" | "hihat", duration: string = "8n") {
    const frequencies = { kick: "60", snare: "200", hihat: "150" };
    this.drums[drum]?.triggerAttackRelease(
      frequencies[drum],
      duration
    );
  }

  async generateSong(
    lyrics: string,
    bpm: number = 120,
    key: string = "C4",
    genre: string = "Pop"
  ) {
    await this.start();

    const now = Tone.now();
    const beatDuration = (60 / bpm) * 1000;
    const noteDuration = "8n";

    // Simple chord progression based on genre
    const progressions: { [key: string]: string[] } = {
      Pop: ["C", "G", "Am", "F"],
      RnB: ["Cm", "Bb", "Eb", "Bb"],
      HipHop: ["Em", "G", "D", "A"],
      Afrobeats: ["Am", "F", "C", "G"],
      Gospel: ["C", "F", "G", "C"],
      Jazz: ["Cmaj7", "Dm7", "G7", "Cmaj7"],
      Rock: ["E", "B", "C#m", "A"],
    };

    const progression = progressions[genre] || progressions.Pop;

    // Play chord progression
    progression.forEach((chord, index) => {
      const time = now + (index * beatDuration) / 1000;
      if (this.synths.chords) {
      (this.synths.chords as any).triggerAttackRelease(chord, "4n", time);
    }
    });

    // Play drum pattern
    const drumPattern = [
      { drum: "kick" as const, beat: 0 },
      { drum: "hihat" as const, beat: 0.5 },
      { drum: "snare" as const, beat: 1 },
      { drum: "hihat" as const, beat: 1.5 },
      { drum: "kick" as const, beat: 2 },
      { drum: "hihat" as const, beat: 2.5 },
      { drum: "snare" as const, beat: 3 },
      { drum: "hihat" as const, beat: 3.5 },
    ];

    drumPattern.forEach(({ drum, beat }) => {
      const time = now + (beat * beatDuration) / 1000;
      this.playDrumSound(drum, "16n");
    });

    // Synthesize vocals from lyrics
    const words = lyrics.split(" ");
    const noteSequence = ["C4", "D4", "E4", "F4", "G4", "A4", "B4"];

    words.forEach((word, index) => {
      const noteIndex = index % noteSequence.length;
      const time = now + (index * beatDuration) / 1000;
      this.playNote(noteSequence[noteIndex], noteDuration, "vocals");
    });
  }

  exportWAV(): Promise<Blob> {
    return new Promise((resolve) => {
      const offlineContext = new OfflineAudioContext(2, 44100 * 10, 44100);
      // This is a placeholder - actual WAV export would require more complex implementation
      resolve(new Blob([], { type: "audio/wav" }));
    });
  }
}

export default MusicSynthesizer;
