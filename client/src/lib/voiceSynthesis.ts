/**
 * Voice Synthesis Utilities for Dieter
 * Integrates multiple TTS engines for real singing from lyrics
 */

export interface VoiceSynthesisOptions {
  lyrics: string;
  melody?: string; // Musical notes like "C4 D4 E4 F4 G4"
  voice?: string;
  pitch?: number;
  rate?: number;
  duration?: number;
}

/**
 * Sing using ResponsiveVoice (51 languages, high quality)
 */
export async function singWithResponsiveVoice(options: VoiceSynthesisOptions): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      (window as any).responsiveVoice.speak(options.lyrics, options.voice || 'UK English Female', {
        pitch: options.pitch || 1.2,
        rate: options.rate || 0.9,
        onend: () => resolve(),
      });
    } else {
      console.warn('ResponsiveVoice not loaded');
      resolve();
    }
  });
}

/**
 * Sing using Puter.js (Free Wavenet-quality voices)
 */
export async function singWithPuter(options: VoiceSynthesisOptions): Promise<void> {
  try {
    if (typeof window !== 'undefined' && (window as any).puter?.tts) {
      await (window as any).puter.tts.speak(options.lyrics, {
        voice: options.voice || 'en-US-Wavenet-D',
        pitch: options.pitch || 1.0,
        rate: options.rate || 1.0,
      });
    }
  } catch (error) {
    console.error('Puter.js error:', error);
  }
}

/**
 * Web Audio API synthesis for melody control
 */
export async function synthesizeWithWebAudio(options: VoiceSynthesisOptions): Promise<AudioBuffer | null> {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Parse melody notes (e.g., "C4 D4 E4")
    const notes = (options.melody || 'C4 E4 G4 C5').split(' ');
    
    // Create oscillator for each note
    for (const note of notes) {
      const frequency = noteToFrequency(note);
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Envelope: attack, sustain, release
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
      gainNode.gain.linearRampToValueAtTime(0.2, now + 0.4); // Release
      
      oscillator.start(now);
      oscillator.stop(now + 0.5);
    }
    
    return null; // Web Audio plays directly
  } catch (error) {
    console.error('Web Audio synthesis error:', error);
    return null;
  }
}

/**
 * Convert musical note to frequency (Hz)
 * C4 = 262Hz, D4 = 294Hz, etc.
 */
export function noteToFrequency(note: string): number {
  const noteMap: { [key: string]: number } = {
    C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11,
  };
  
  const match = note.match(/([A-G])#?(\d)/);
  if (!match) return 440; // Default to A4
  
  const noteName = match[1];
  const octave = parseInt(match[2]);
  
  const semitone = noteMap[noteName] || 0;
  const noteNumber = (octave + 1) * 12 + semitone;
  
  // A4 = 440Hz, A0 = 27.5Hz
  return 440 * Math.pow(2, (noteNumber - 57) / 12);
}

/**
 * Main singing function - tries multiple engines with fallback
 */
export async function sing(options: VoiceSynthesisOptions): Promise<void> {
  console.log('🎤 Starting voice synthesis:', options);
  
  try {
    // Try ResponsiveVoice first (best quality)
    if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
      await singWithResponsiveVoice(options);
      return;
    }
    
    // Fallback to Puter.js
    if (typeof window !== 'undefined' && (window as any).puter?.tts) {
      await singWithPuter(options);
      return;
    }
    
    // Fallback to Web Audio
    await synthesizeWithWebAudio(options);
  } catch (error) {
    console.error('Voice synthesis failed:', error);
  }
}

/**
 * Stop current playback
 */
export function stopPlayback(): void {
  if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
    (window as any).responsiveVoice.cancel();
  }
}

/**
 * Generate melody from lyrics (simple algorithm)
 */
export function generateMelodyFromLyrics(lyrics: string, bpm: number = 128): string {
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
  const words = lyrics.split(' ');
  
  return words
    .map((_, i) => notes[i % notes.length])
    .join(' ');
}
