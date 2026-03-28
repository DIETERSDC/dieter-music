import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  downloadAudio,
  getAudioDuration,
  createSilentAudioBuffer,
  webmToWav,
  playAudioBlob,
} from './audioExport';

describe('Audio Export Utilities', () => {
  beforeEach(() => {
    // Mock DOM methods
    vi.spyOn(document, 'createElement').mockReturnValue({
      click: vi.fn(),
      href: '',
      download: '',
    } as any);
    
    vi.spyOn(document.body, 'appendChild').mockReturnValue(null as any);
    vi.spyOn(document.body, 'removeChild').mockReturnValue(null as any);
    
    // Mock URL methods
    global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('downloadAudio', () => {
    it('should create and trigger download link', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
      const createElementSpy = vi.spyOn(document, 'createElement');
      
      downloadAudio(mockBlob, 'test-track', 'webm');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    it('should append .wav extension if not present', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/wav' });
      const createElementSpy = vi.spyOn(document, 'createElement');
      
      downloadAudio(mockBlob, 'test-track', 'wav');
      
      expect(createElementSpy).toHaveBeenCalled();
    });

    it('should handle different audio formats', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/mp3' });
      
      expect(() => {
        downloadAudio(mockBlob, 'test-track', 'mp3');
      }).not.toThrow();
    });
  });

  describe('createSilentAudioBuffer', () => {
    it('should create audio buffer with default duration', () => {
      const buffer = createSilentAudioBuffer();
      
      expect(buffer).toBeDefined();
      expect(buffer.numberOfChannels).toBe(1);
      expect(buffer.length).toBeGreaterThan(0);
    });

    it('should create audio buffer with custom duration', () => {
      const buffer = createSilentAudioBuffer(5);
      
      expect(buffer).toBeDefined();
      expect(buffer.numberOfChannels).toBe(1);
    });
  });

  describe('webmToWav', () => {
    it('should convert WebM blob to WAV', async () => {
      const mockBlob = new Blob(['webm data'], { type: 'audio/webm' });
      const result = await webmToWav(mockBlob);
      
      expect(result).toBeDefined();
      expect(result.type).toBe('audio/webm');
    });
  });

  describe('playAudioBlob', () => {
    it('should create and play audio element', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
      const audioPlaySpy = vi.spyOn(HTMLAudioElement.prototype, 'play').mockResolvedValue(undefined);
      
      playAudioBlob(mockBlob);
      
      expect(audioPlaySpy).toHaveBeenCalled();
    });

    it('should handle playback errors gracefully', () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      vi.spyOn(HTMLAudioElement.prototype, 'play').mockRejectedValue(new Error('Playback failed'));
      
      playAudioBlob(mockBlob);
      
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getAudioDuration', () => {
    it('should return audio duration', async () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
      
      // Mock Audio element
      const mockAudio = {
        addEventListener: vi.fn((event, callback) => {
          if (event === 'loadedmetadata') {
            setTimeout(() => callback(), 0);
          }
        }),
        duration: 3.5,
      };
      
      vi.spyOn(global, 'Audio').mockImplementation(() => mockAudio as any);
      
      const duration = await getAudioDuration(mockBlob);
      
      expect(duration).toBeGreaterThanOrEqual(0);
    });

    it('should return 0 on error', async () => {
      const mockBlob = new Blob(['audio data'], { type: 'audio/webm' });
      
      const mockAudio = {
        addEventListener: vi.fn((event, callback) => {
          if (event === 'error') {
            setTimeout(() => callback(), 0);
          }
        }),
      };
      
      vi.spyOn(global, 'Audio').mockImplementation(() => mockAudio as any);
      
      const duration = await getAudioDuration(mockBlob);
      
      expect(duration).toBe(0);
    });
  });
});
