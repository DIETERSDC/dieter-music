/**
 * Dieter Music - Web Audio API Synthesizer
 * Complete music generation engine using Web Audio API + Tone.js
 * Generates: Melody, Harmony, Drums, Bass, Effects in real-time
 */

import * as Tone from 'tone';

// ============================================================================
// Music Theory Constants
// ============================================================================

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const CHORD_PROGRESSIONS: Record<string, string[][]> = {
  pop: [['C', 'Am', 'F', 'G'], ['Am', 'F', 'C', 'G']],
  rnb: [['Cmaj7', 'Am7', 'Dm7', 'G7'], ['Fmaj7', 'Bm7b5', 'E7', 'Am7']],
  hiphop: [['C', 'C', 'F', 'G'], ['Am', 'Am', 'Dm', 'G']],
  afrobeats: [['Cm', 'Cm', 'Fm', 'G'], ['Dm', 'Dm', 'Gm', 'A']],
  gospel: [['C', 'F', 'C', 'G'], ['Am', 'Dm', 'G', 'C']],
  jazz: [['Cmaj7', 'Dm7', 'G7', 'Cmaj7'], ['Fmaj7', 'B♭maj7', 'Em7', 'A7']],
  rock: [['C', 'F', 'C', 'G'], ['Am', 'F', 'C', 'G']],
};

const DRUM_PATTERNS: Record<string, { kick: number[]; snare: number[]; hihat: number[] }> = {
  pop: {
    kick: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    snare: [0.5, 1.5, 2.5, 3.5],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
  },
  rnb: {
    kick: [0, 0.75, 1.5, 2.25, 3],
    snare: [0.5, 1.5, 2.5, 3.5],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  },
  hiphop: {
    kick: [0, 0.5, 1, 2, 2.5, 3.5],
    snare: [1, 3],
    hihat: [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75],
  },
  afrobeats: {
    kick: [0, 0.75, 1.5, 2.5, 3.25],
    snare: [0.5, 1.5, 2.5, 3.5],
    hihat: [0, 0.375, 0.75, 1.125, 1.5, 1.875, 2.25, 2.625, 3, 3.375, 3.75],
  },
  gospel: {
    kick: [0, 1, 2, 3],
    snare: [0.5, 1.5, 2.5, 3.5],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
  },
  jazz: {
    kick: [0, 1, 2, 3],
    snare: [0.5, 1.5, 2.5, 3.5],
    hihat: [0, 0.33, 0.66, 1, 1.33, 1.66, 2, 2.33, 2.66, 3, 3.33, 3.66],
  },
  rock: {
    kick: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
    snare: [1, 3],
    hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75],
  },
};

// ============================================================================
// Music Synthesizer Class
// ============================================================================

export class MusicSynthesizer {
  private synth: Tone.PolySynth;
  private bass: Tone.Synth;
  private drums: { kick: Tone.Synth; snare: Tone.Synth; hihat: Tone.Synth };
  private chords: Tone.PolySynth;
  private reverb: Tone.Reverb;
  private delay: Tone.Delay;
  private compressor: Tone.Compressor;
    private fmSynth: Tone.FMSynth;
  private amSynth: Tone.AMSynth;
  private pluckSynth: Tone.PluckSynth;
  
  // Advanced effects
  private distortion: Tone.Distortion;
  private chorus: Tone.Chorus;
  private phaser: Tone.Phaser;
  private autoFilter: Tone.AutoFilter;
  private pitchShift: Tone.PitchShift;
  
  // Arpeggiator
  private arpeggiator: Tone.Pattern | null = null;
  private arpPattern: 'up' | 'down' | 'upDown' | 'random' = 'up';
  private master: Tone.Gain;
  private analyser: Tone.Analyser;
    
  // Beat detection properties
  private beatAnalyser: Tone.Analyser | null = null;
  private lastBeatTime: number = 0;
  private beatThreshold: number = 0.6;
  private beatCallbacks: Array<(energy: number, time: number) => void> = [];
  private beatDetectionInterval: number | null = null;
  
  // Web Speech API for voice synthesis
  private speechSynthesis: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private selectedVoiceName: string = 'female-soprano';
  
  private isPlaying = false;
  private currentTime = 0;
  private totalDuration = 0;
  private bpm = 120;
  private key = 'C';
  private genre = 'pop';
  private melody: string[] = [];
  private chordProgression: string[] = [];
  private bassLine: string[] = [];
  
  // Channel gains for mixer
  public channelGains: Record<string, Tone.Gain> = {};

  constructor() {
    // Initialize synths
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 },
    }).toDestination();

    this.bass = new Tone.Synth({
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.01, decay: 0.2, sustain: 0.2, release: 0.5 },
    }).toDestination();

    this.drums = {
      kick: new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
      }).toDestination(),
      snare: new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.2, sustain: 0, release: 0.05 },
      }).toDestination(),
      hihat: new Tone.Synth({
        oscillator: { type: 'square' },
        envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.01 },
      }).toDestination(),
    };

    this.chords = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.05, decay: 0.3, sustain: 0.2, release: 0.5 },
    }).toDestination();

        // Initialize advanced synths
    this.fmSynth = new Tone.FMSynth({
      harmonicity: 3,
      modulationIndex: 10,
      oscillator: { type: 'sine' },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.5 },
      modulation: { type: 'square' },
      modulationEnvelope: { attack: 0.2, decay: 0.01, sustain: 1, release: 0.5 }
    }).toDestination();
    
    this.amSynth = new Tone.AMSynth({
      harmonicity: 2,
      oscillator: { type: 'fmsine' },
      envelope: { attack: 0.01, decay: 0.5, sustain: 0.2, release: 0.5 },
      modulation: { type: 'square' },
      modulationEnvelope: { attack: 0.5, decay: 0.01, sustain: 1, release: 0.5 }
    }).toDestination();
    
    this.pluckSynth = new Tone.PluckSynth({
      attackNoise: 1,
      dampening: 4000,
      resonance: 0.9
    }).toDestination();

    // Effects
    this.reverb = new Tone.Reverb(2).toDestination();
    this.delay = new Tone.Delay(0.5).connect(this.reverb);
    this.compressor = new Tone.Compressor(-30, 3).connect(this.delay);
    this.master = new Tone.Gain(0.8).connect(this.compressor);

    // Connect synths to master
    this.synth.connect(this.master);
        
    // Initialize advanced effects
    this.distortion = new Tone.Distortion(0.8).toDestination();
    this.chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination();
    this.phaser = new Tone.Phaser({
      frequency: 15,
      octaves: 5,
      baseFrequency: 1000
    }).toDestination();
    this.autoFilter = new Tone.AutoFilter({
      frequency: 1,
      type: 'sine',
      depth: 1,
      baseFrequency: 200,
      octaves: 2.6
    }).toDestination();
    this.pitchShift = new Tone.PitchShift(0).toDestination();
    this.bass.connect(this.master);
    this.chords.connect(this.master);
    Object.values(this.drums).forEach(drum => drum.connect(this.master));

    // Analyser for waveform visualization
    this.analyser = new Tone.Analyser('waveform');
    this.master.connect(this.analyser);

    // Initialize channel gains
    this.channelGains = {
          this.master.connect(this.analyser);
    
    // Initialize beat detection analyser
    this.beatAnalyser = new Tone.Analyser('fft', 512);
    this.master.connect(this.beatAnalyser);
      vocals: new Tone.Gain(0.8),
      harmony: new Tone.Gain(0.6),
      kick: new Tone.Gain(0.9),
      snare: new Tone.Gain(0.8),
      hihat: new Tone.Gain(0.5),
      bass: new Tone.Gain(0.7),
      chords: new Tone.Gain(0.6),
      fx: new Tone.Gain(0.4),
    };

    // Connect channels to master
    Object.values(this.channelGains).forEach(gain => gain.connect(this.master));

        // Initialize Web Speech API
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.speechSynthesis = window.speechSynthesis;
    }
  }

    /**
   * Set the voice for synthesis
   */
  setVoice(voiceId: string) {
    this.selectedVoiceName = voiceId;
  }

  /**
   * Get the appropriate voice for the selected voice type
   */
  private getVoiceForSelection(): SpeechSynthesisVoice | null {
    if (!this.speechSynthesis) return null;
    
    const voices = this.speechSynthesis.getVoices();
    const voiceMap: Record<string, string[]> = {
      'male-deep': ['Google US English', 'Microsoft David', 'Alex'],
      'male-warm': ['Google UK English Male', 'Microsoft Mark'],
      'male-bright': ['Daniel', 'Microsoft Ravi'],
      'female-soprano': ['Google US English Female', 'Microsoft Zira', 'Samantha'],
      'female-alto': ['Google UK English Female', 'Microsoft Hazel', 'Victoria'],
      'female-breathy': ['Fiona', 'Microsoft Eva', 'Karen']
    };
    
    const preferredNames = voiceMap[this.selectedVoiceName] || [];
    for (const name of preferredNames) {
      const voice = voices.find(v => v.name.includes(name));
      if (voice) return voice;
    }
    
    // Fallback to first English voice or any voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }

  /**
   * Generate melody from lyrics
   * Maps syllables to notes in the scale
   */
  private generateMelody(lyrics: string, key: string, scale: string[] = ['C', 'D', 'E', 'F', 'G', 'A', 'B']): string[] {
    const words = lyrics.split(/\s+/);
    const melody: string[] = [];
    const keyIndex = NOTES.indexOf(key);
    
    words.forEach((word, idx) => {
      const syllables = word.split(/[aeiou]/i).filter(s => s.length > 0).length || 1;
      for (let i = 0; i < syllables; i++) {
        const noteIndex = (idx + i) % scale.length;
        const octave = 4 + Math.floor((idx + i) / scale.length);
        const note = scale[noteIndex];
        melody.push(`${note}${octave}`);
      }
    });

    return melody;
  }

  /**
   * Generate chord progression based on genre
   */
  private generateChordProgression(genre: string, key: string, bars: number): string[] {
    const patterns = CHORD_PROGRESSIONS[genre] || CHORD_PROGRESSIONS.pop;
    const pattern = patterns[0];
    const progression: string[] = [];

    for (let i = 0; i < bars; i++) {
      progression.push(...pattern);
    }

    return progression.slice(0, bars);
  }

  /**
   * Generate bass line
   */
  private generateBassLine(chords: string[], key: string): string[] {
    return chords.map(chord => {
      const rootNote = chord.replace(/[^A-G#]/g, '');
      return `${rootNote}2`;
    });
  }

  /**
   * Synthesize complete song
   */
  async synthesize(
    lyrics: string,
    key: string = 'C',
    bpm: number = 120,
    genre: string = 'pop',
    durationSeconds: number = 30
  ): Promise<void> {
    await Tone.start();

    this.key = key;
    this.bpm = bpm;
    this.genre = genre;
    this.totalDuration = durationSeconds;

    // Set tempo
    Tone.Transport.bpm.value = bpm;

    // Generate musical elements
    this.melody = this.generateMelody(lyrics, key);
    const bars = Math.ceil(durationSeconds / (240 / bpm)); // 4 beats per bar
    this.chordProgression = this.generateChordProgression(genre, key, bars);
    this.bassLine = this.generateBassLine(this.chordProgression, key);

    // Schedule melody
    this.scheduleMelody();

    // Schedule chords
    this.scheduleChords();

    // Schedule bass
    this.scheduleBass();

    // Schedule drums
    this.scheduleDrums(genre);

    // Schedule voice synthesis
    this.scheduleVoiceSynthesis// Add vocal synthesis with Web Speech API
    if (this.speechSynthesis && lyrics.trim()) {
      const utterance = new SpeechSynthesisUtterance(lyrics);
      const voice = this.getVoiceForSelection();
      
      if (voice) {
        utterance.voice = voice;
        utterance.pitch = 1.2; // Slightly higher for singing effect
        utterance.rate = (60 / bpm) * 4; // Sync with BPM
        utterance.volume = 0.7;
        
        this.currentUtterance = utterance;
        setTimeout(() => {
          this.speechSynthesis!.speak(utterance);
        }, 100); // Small delay to sync with music
      }
    }

    // Start playback
    this.isPlaying = true;
    Tone.Transport.start();
        this.startBeatDetection();
  }

  /**
   * Schedule melody notes
   */
  private scheduleMelody(): void {
    const noteLength = `${240 / this.bpm}n`; // 16th note
    const now = Tone.now();

    this.melody.forEach((note, idx) => {
      const time = now + (idx * (240 / this.bpm) / 1000);
      Tone.Transport.schedule(() => {
        this.synth.triggerAttackRelease(note, noteLength);
      }, `+${idx * (240 / this.bpm) / 1000}`);
    });
  }

  /**
   * Schedule chord progression
   */
  private scheduleChords(): void {
    const beatLength = `${240 / this.bpm}n`;
    const now = Tone.now();

    this.chordProgression.forEach((chord, idx) => {
      const time = now + (idx * 4 * (240 / this.bpm) / 1000);
      Tone.Transport.schedule(() => {
        const notes = this.getChordNotes(chord);
        this.chords.triggerAttackRelease(notes, `${4 * (240 / this.bpm)}n`);
      }, `+${idx * 4 * (240 / this.bpm) / 1000}`);
    });
  }

  /**
   * Schedule bass line
   */
  private scheduleBass(): void {
    const beatLength = `${240 / this.bpm}n`;

    this.bassLine.forEach((note, idx) => {
      Tone.Transport.schedule(() => {
        this.bass.triggerAttackRelease(note, `${4 * (240 / this.bpm)}n`);
      }, `+${idx * 4 * (240 / this.bpm) / 1000}`);
    });
  }

  /**
   * Schedule drum patterns
   */
  private scheduleDrums(genre: string): void {
    const pattern = DRUM_PATTERNS[genre] || DRUM_PATTERNS.pop;
    const beatDuration = 240 / this.bpm / 1000;

    // Kick
    pattern.kick.forEach(beat => {
      Tone.Transport.schedule(() => {
        this.drums.kick.triggerAttackRelease('C1', '8n');
      }, `+${beat * beatDuration}`);
    });

    // Snare
    pattern.snare.forEach(beat => {
      Tone.Transport.schedule(() => {
        this.drums.snare.triggerAttackRelease('C3', '16n');
      }, `+${beat * beatDuration}`);
    });

    // Hi-hat
    pattern.hihat.forEach(beat => {
      Tone.Transport.schedule(() => {
        this.drums.hihat.triggerAttackRelease('C4', '32n');
      }, `+${beat * beatDuration}`);
    });
  }

  /**
   * Schedule voice synthesis using Web Speech API
   */
  private scheduleVoiceSynthesis(lyrics: string): void {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(lyrics);
    utterance.rate = 1.2;
    utterance.pitch = 1.5;
    utterance.volume = 0.8;

    Tone.Transport.schedule(() => {
      synth.speak(utterance);
    }, '+0');
  }

  /**
   * Get notes for a chord
   */
  private getChordNotes(chord: string): string[] {
    const chordMap: Record<string, string[]> = {
      'C': ['C4', 'E4', 'G4'],
      'Cm': ['C4', 'Eb4', 'G4'],
      'Cmaj7': ['C4', 'E4', 'G4', 'B4'],
      'Am': ['A3', 'C4', 'E4'],
      'Am7': ['A3', 'C4', 'E4', 'G4'],
      'F': ['F3', 'A3', 'C4'],
      'Fmaj7': ['F3', 'A3', 'C4', 'E4'],
      'G': ['G3', 'B3', 'D4'],
      'G7': ['G3', 'B3', 'D4', 'F4'],
      'Dm': ['D3', 'F3', 'A3'],
      'Dm7': ['D3', 'F3', 'A3', 'C4'],
      'Fm': ['F3', 'Ab3', 'C4'],
      'E': ['E3', 'G#3', 'B3'],
      'E7': ['E3', 'G#3', 'B3', 'D4'],
    };

    return chordMap[chord] || ['C4', 'E4', 'G4'];
  }

  /**
   * Play/Pause
   */
  togglePlayback(): void {
    if (this.isPlaying) {
      Tone.Transport.pause();
    } else {
      Tone.Transport.start();
    }
    this.isPlaying = !this.isPlaying;
  }

  /**
   * Stop playback
   */
  stop(): void {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.isPlaying = false;
    this.currentTime = 0;
        this.stopBeatDetection();
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.master.gain.value = Math.max(0, Math.min(1, volume));
  }

  /**
   * Set channel volume
   */
  setChannelVolume(channel: string, volume: number): void {
    if (this.channelGains[channel]) {
      this.channelGains[channel].gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get waveform data for visualization
   */
  getWaveformData(): Float32Array {
    const data = this.analyser.getValue();
    return Array.isArray(data) ? data[0] : data;
  }

  /**
   * Export as WAV
   */
  async exportWAV(): Promise<Blob> {
    // Record audio
    const recorder = new Tone.Recorder();
    this.master.connect(recorder);

    await Tone.start();
    Tone.Transport.start();

    await new Promise(resolve => setTimeout(resolve, this.totalDuration * 1000));

    const audio = await recorder.stop();
    return audio;
  }

  /**
   * Detect BPM from lyrics
   */
  detectBPM(lyrics: string): number {
    const syllableCount = (lyrics.match(/[aeiou]/gi) || []).length;
    const lineCount = lyrics.split('\n').length;
    const density = syllableCount / lineCount;

    // Map density to BPM
    if (density < 3) return 90;
    if (density < 5) return 100;
    if (density < 7) return 120;
    if (density < 10) return 140;
    return 160;
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    return Tone.Transport.seconds;
  }

  /**
   * Seek to time
   */
  seek(seconds: number): void {
    Tone.Transport.seconds = seconds;
  }

  /**
   * Cleanup
   */
  dispose(): void {
    /**
   * Start beat detection
   */
  startBeatDetection(): void {
    if (this.beatDetectionInterval) return;
    
    const detectBeat = () => {
      if (!this.beatAnalyser) return;
      
      const values = this.beatAnalyser.getValue() as Float32Array;
      const sum = values.reduce((acc, val) => acc + Math.abs(val), 0);
      const average = sum / values.length;
      const energy = average;
      
      const now = Tone.now();
      const timeSinceLastBeat = now - this.lastBeatTime;
      const minBeatInterval = (60 / this.bpm) * 0.25; // Min 1/4 beat
      
      if (energy > this.beatThreshold && timeSinceLastBeat > minBeatInterval) {
        this.lastBeatTime = now;
        this.beatCallbacks.forEach(callback => callback(energy, now));
      }
    };
    
    this.beatDetectionInterval = window.setInterval(detectBeat, 50) as unknown as number;
  }
  
  /**
   * Stop beat detection
   */
  stopBeatDetection(): void {
    if (this.beatDetectionInterval) {
      clearInterval(this.beatDetectionInterval);
      this.beatDetectionInterval = null;
    }
  }
  
  /**
   * Register callback for beat events
   */
  onBeat(callback: (energy: number, time: number) => void): void {
    this.beatCallbacks.push(callback);
  }
  
  /**
   * Clear all beat callbacks
   */
  clearBeatCallbacks(): void {
    this.beatCallbacks = [];
  }
  
  /**
   * Set beat detection threshold
   */
  setBeatThreshold(threshold: number): void {
    this.beatThreshold = Math.max(0, Math.min(1, threshold));
  }
  
  /**
   * Get current beat energy level
   */
  getBeatEnergy(): number {
    if (!this.beatAnalyser) return 0;
    
    const values = this.beatAnalyser.getValue() as Float32Array;
    const sum = values.reduce((acc, val) => acc + Math.abs(val), 0);
    return sum / values.length;
  }


    this.stop();
    this.synth.dispose();
    this.bass.dispose();
    Object.values(this.drums).forEach(drum => drum.dispose());
    this.chords.dispose();
    this.reverb.dispose();
    this.delay.dispose();
    this.compressor.dispose();
    this.master.dispose();
  }
}

// Export singleton
let synthesizer: MusicSynthesizer | null = null;

export function getSynthesizer(): MusicSynthesizer {
  if (!synthesizer) {
    synthesizer = new MusicSynthesizer();
  }
  return synthesizer;
}
