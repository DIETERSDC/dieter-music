import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface PlaybackModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle: string;
  lyrics: string;
  audioUrl: string;
}

interface LyricLine {
  text: string;
  startTime: number;
  endTime: number;
}

const PlaybackModal: React.FC<PlaybackModalProps> = ({
  isOpen,
  onClose,
  songTitle,
  lyrics,
  audioUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  
  // Parse lyrics into timed lines (estimate timing based on line count)
  const parseLyrics = (): LyricLine[] => {
    const lines = lyrics.split('\n').filter(line => line.trim());
    const estimatedDuration = duration || 180; // Default 3 minutes
    const timePerLine = estimatedDuration / lines.length;
    
    return lines.map((text, index) => ({
      text,
      startTime: index * timePerLine,
      endTime: (index + 1) * timePerLine,
    }));
  };

  const lyricLines = parseLyrics();

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  // Update current line based on time
  useEffect(() => {
    const currentIndex = lyricLines.findIndex(
      (line) => currentTime >= line.startTime && currentTime < line.endTime
    );
    if (currentIndex !== -1) {
      setCurrentLineIndex(currentIndex);
    }
  }, [currentTime, lyricLines]);

  // Auto-scroll lyrics
  useEffect(() => {
    const container = lyricsContainerRef.current;
    if (!container) return;

    const currentElement = container.querySelector(`[data-line-index="${currentLineIndex}"]`);
    if (currentElement) {
      currentElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentLineIndex]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[90vh] bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-cyan-900/95 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-3xl font-bold text-white mb-2">{songTitle}</h2>
          <p className="text-cyan-300">Now Playing</p>
        </div>

        {/* Lyrics Display */}
        <div
          ref={lyricsContainerRef}
          className="h-[calc(90vh-280px)] overflow-y-auto px-8 py-12 scrollbar-thin scrollbar-thumb-cyan-500/50 scrollbar-track-transparent"
        >
          <div className="space-y-6">
            {lyricLines.map((line, index) => (
              <div
                key={index}
                data-line-index={index}
                className={`text-center transition-all duration-500 transform ${
                  index === currentLineIndex
                    ? 'text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 scale-110'
                    : index < currentLineIndex
                    ? 'text-2xl text-white/40'
                    : 'text-2xl text-white/60'
                }`}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>

        {/* Audio Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent backdrop-blur-md">
          {/* Progress Bar */}
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-gradient-to-r
                [&::-webkit-slider-thumb]:from-cyan-400
                [&::-webkit-slider-thumb]:to-purple-500
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg
                [&::-webkit-slider-thumb]:shadow-cyan-500/50"
            />
            <div className="flex justify-between mt-2 text-sm text-white/70">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={toggleMute}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>
            
            <button
              onClick={togglePlayPause}
              className="p-6 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-cyan-500/50"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </div>
    </div>
  );
};

export default PlaybackModal;
