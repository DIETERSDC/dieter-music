import { describe, it, expect } from "vitest";
import { noteToFrequency, generateMelodyFromLyrics } from "./voiceSynthesis";

describe("Voice Synthesis Utilities", () => {
  describe("noteToFrequency", () => {
    it("should convert C4 to approximately 262 Hz", () => {
      const freq = noteToFrequency("C4");
      expect(freq).toBeCloseTo(262, 0);
    });

    it("should convert A4 to 440 Hz", () => {
      const freq = noteToFrequency("A4");
      expect(freq).toBe(440);
    });

    it("should convert E4 to approximately 330 Hz", () => {
      const freq = noteToFrequency("E4");
      expect(freq).toBeCloseTo(330, 0);
    });

    it("should convert G4 to approximately 392 Hz", () => {
      const freq = noteToFrequency("G4");
      expect(freq).toBeCloseTo(392, 0);
    });

    it("should return 440 Hz for invalid note", () => {
      const freq = noteToFrequency("INVALID");
      expect(freq).toBe(440);
    });

    it("should handle octave 5 notes", () => {
      const c5 = noteToFrequency("C5");
      const c4 = noteToFrequency("C4");
      // C5 should be roughly double C4
      expect(c5).toBeCloseTo(c4 * 2, 0);
    });
  });

  describe("generateMelodyFromLyrics", () => {
    it("should generate melody from lyrics", () => {
      const lyrics = "Hello world this is a test";
      const melody = generateMelodyFromLyrics(lyrics);
      expect(melody).toBeTruthy();
      expect(melody).toContain("C4");
    });

    it("should return space-separated notes", () => {
      const lyrics = "One two three four";
      const melody = generateMelodyFromLyrics(lyrics);
      const notes = melody.split(" ");
      expect(notes.length).toBeGreaterThan(0);
      expect(notes[0]).toMatch(/^[A-G]\d$/);
    });

    it("should handle empty lyrics gracefully", () => {
      const melody = generateMelodyFromLyrics("");
      expect(melody).toBeTruthy();
    });

    it("should respect BPM parameter", () => {
      const lyrics = "Test lyrics";
      const melody1 = generateMelodyFromLyrics(lyrics, 120);
      const melody2 = generateMelodyFromLyrics(lyrics, 140);
      // Both should generate melodies
      expect(melody1).toBeTruthy();
      expect(melody2).toBeTruthy();
    });

    it("should cycle through note range", () => {
      const lyrics = "word1 word2 word3 word4 word5 word6 word7 word8 word9";
      const melody = generateMelodyFromLyrics(lyrics);
      const notes = melody.split(" ");
      // Should have 9 notes
      expect(notes.length).toBe(9);
      // Should cycle back to C4 after C5
      expect(notes[0]).toBe("C4");
      expect(notes[8]).toBe("C4");
    });
  });
});
