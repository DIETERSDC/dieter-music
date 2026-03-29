/**
 * Playback Modal Component - Full-screen playback with karaoke-style synced lyrics
 * Opens in new window when song generation completes
 * Features:
 * - Beautiful animated gradient background
 * - Word-by-word lyrics highlighting synced to audio
 * - Waveform visualization
 * - Playback controls
 */

import { useEffect, useState, useRef } from 'react';
import { X, Play, Pause, Volume2, Download } from 'lucide-react';

interface PlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  lyrics: string;
  audioUrl?: string;
  waveformData?: Float32Array;
  currentTime: number;
  duration: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
}

interface LyricsWord {
  word: string;
  startTime: number;
  endTime: number;
  index: number;
}

export function PlaybackModal({
  isOpen,
  onClose,
  lyrics,
  currentTime,
  duration,
  isPlaying,
  onPlayPause,
  onSeek
}: PlaybackModalProps) {
  const [words, setWords] = useState<LyricsWord[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse lyrics into words with estimated timing
  useEffect(() => {
    if (!lyrics) return;
    
    const allWords = lyrics.split(/\s+/).filter(w => w.length > 0);
    const wordDuration = duration / allWords.length;
    
    const parsedWords: LyricsWord[] = allWords.map((word, index) => ({
      word,
      startTime: index * wordDuration,
      endTime: (index + 1) * wordDuration,
      index
    }));
    
    setWords(parsedWords);
  }, [lyrics, duration]);

  // Update current word based on playback time
  useEffect(() => {
    if (!isPlaying) return;
    
    const currentIndex = words.findIndex(
      w => currentTime >= w.startTime && currentTime < w.endTime
    );
    
    if (currentIndex !== -1 && currentIndex !== currentWordIndex) {
      setCurrentWordIndex(currentIndex);
      
      // Auto-scroll to current word
      const wordElement = document.getElementById(`word-${currentIndex}`);
      if (wordElement && containerRef.current) {
        wordElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentTime, words, isPlaying, currentWordIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full h-full max-w-7xl mx-auto p-8 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-8">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-800 to-blue-900 opacity-50 animate-gradient-shift" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))] animate-pulse" />
          
          {/* Title */}
          <div className="relative z-10 text-center space-y-2">
            <h1 className="text-6xl font-bold text-white drop-shadow-2xl animate-fade-in">
              Now Playing
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full animate-pulse" />
          </div>

          {/* Karaoke Lyrics Display */}
          <div 
            ref={containerRef}
            className="relative z-10 w-full max-w-4xl h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent px-8"
          >
            <div className="flex flex-wrap justify-center items-center gap-4 text-center">
              {words.map((wordObj, index) => (
                <span
                  key={index}
                  id={`word-${index}`}
                  className={`
                    text-4xl font-bold transition-all duration-300 cursor-pointer
                    ${
                      index === currentWordIndex
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 scale-125 drop-shadow-[0_0_20px_rgba(34,211,238,0.8)]'
                        : index < currentWordIndex
                        ? 'text-white/60'
                        : 'text-white/30'
                    }
                  `}
                  onClick={() => onSeek(wordObj.startTime)}
                >
                  {wordObj.word}
                </span>
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 w-full max-w-2xl space-y-2">
            <div className="relative h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer group"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                onSeek(percent * duration);
              }}
            >
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            </div>
            <div className="flex justify-between text-sm text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="relative z-10 flex items-center gap-6">
            <button
              onClick={onPlayPause}
              className="p-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all hover:scale-110 shadow-lg hover:shadow-2xl"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-gradient-shift {
          animation: gradient-shift 10s ease infinite;
          background-size: 200% 200%;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
