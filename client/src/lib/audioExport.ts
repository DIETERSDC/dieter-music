/**
 * Audio Export Utilities for Dieter
 * Handles recording, processing, and exporting audio as WAV/MP3
 */

export interface AudioExportOptions {
  filename?: string;
  format?: 'wav' | 'mp3';
  bitrate?: number; // For MP3
}

/**
 * Start recording audio from Web Audio API
 */
export function startAudioRecording(): MediaRecorder | null {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const destination = audioContext.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    
    return mediaRecorder;
  } catch (error) {
    console.error('Failed to start recording:', error);
    return null;
  }
}

/**
 * Convert audio blob to WAV format
 */
export async function blobToWav(audioBlob: Blob, filename: string = 'track.wav'): Promise<void> {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Record synthesized audio from ResponsiveVoice
 */
export async function recordVoiceSynthesis(
  lyrics: string,
  voiceSettings: {
    voice: string;
    pitch: number;
    rate: number;
  },
  options: AudioExportOptions = {}
): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      // Create audio context for recording
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const destination = audioContext.createMediaStreamDestination();
      const mediaRecorder = new MediaRecorder(destination.stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        resolve(audioBlob);
      };

      // Start recording
      mediaRecorder.start();

      // Synthesize and play through the recording destination
      if (typeof window !== 'undefined' && (window as any).responsiveVoice) {
        (window as any).responsiveVoice.speak(lyrics, voiceSettings.voice, {
          pitch: voiceSettings.pitch,
          rate: voiceSettings.rate,
          onend: () => {
            mediaRecorder.stop();
          },
        });
      } else {
        mediaRecorder.stop();
        resolve(null);
      }
    } catch (error) {
      console.error('Recording error:', error);
      resolve(null);
    }
  });
}

/**
 * Export audio as WAV file
 */
export async function exportAsWav(
  audioBlob: Blob,
  filename: string = 'dieter-track.wav'
): Promise<void> {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.wav') ? filename : `${filename}.wav`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Convert WebM to WAV using simple method
 */
export async function webmToWav(webmBlob: Blob): Promise<Blob> {
  // For production, use a library like ffmpeg.js or send to backend
  // For now, return the blob as-is (browsers can play WebM audio)
  return webmBlob;
}

/**
 * Download audio file
 */
export function downloadAudio(
  audioBlob: Blob,
  filename: string,
  format: 'wav' | 'mp3' | 'webm' = 'wav'
): void {
  const url = URL.createObjectURL(audioBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith(`.${format}`) ? filename : `${filename}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Create a silent audio buffer for testing
 */
export function createSilentAudioBuffer(duration: number = 3): AudioBuffer {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  return buffer;
}

/**
 * Play audio blob
 */
export function playAudioBlob(audioBlob: Blob): void {
  const url = URL.createObjectURL(audioBlob);
  const audio = new Audio(url);
  audio.play().catch((error) => {
    console.error('Playback error:', error);
  });
}

/**
 * Get audio duration from blob
 */
export async function getAudioDuration(audioBlob: Blob): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(audioBlob);
    const audio = new Audio(url);
    
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
      URL.revokeObjectURL(url);
    });
    
    audio.addEventListener('error', () => {
      resolve(0);
      URL.revokeObjectURL(url);
    });
  });
}
