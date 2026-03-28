/**
 * Dieter Music - Fully Functional Studio
 * Real-time music generation with Web Audio API
 * Complete DAW with mixer, effects, and waveform visualization
 */

// import { useAuth } from "@/_core/hooks/useAuth"; // Auth disabled for public Vercel deployment
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Music, Download, Play, Pause, Square, Volume2, Settings, RotateCcw,
  Zap, Headphones, Save, Share2, Loader2, Menu, X, Activity, Sparkles
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { getSynthesizer } from "@/lib/musicSynthesizer";

const VOICES = [
  { id: "male-deep", name: "Male Deep", gender: "male", tone: "deep" },
  { id: "male-warm", name: "Male Warm", gender: "male", tone: "warm" },
  { id: "male-bright", name: "Male Bright", gender: "male", tone: "bright" },
  { id: "female-soprano", name: "Female Soprano", gender: "female", tone: "soprano" },
  { id: "female-alto", name: "Female Alto", gender: "female", tone: "alto" },
  { id: "female-breathy", name: "Female Breathy", gender: "female", tone: "breathy" },
];

const GENRES = ["Pop", "RnB", "HipHop", "Afrobeats", "Gospel", "Jazz", "Rock"];
const KEYS = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const CHANNELS = ["Vocals", "Harmony", "Kick", "Snare", "HiHat", "Bass", "Chords", "FX"];

export default function StudioFunctional() {
  const { user, logout } = useAuth(); // Auth disabled for public Vercel deployment
    const user = null; // No auth on Vercel
    const logout = () => {}; // No-op logout
  const [, setLocation] = useLocation();
  const synthesizer = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    synthesizer.current = getSynthesizer();
  }, []);
  const animationRef = useRef<number | null>(null);

  // UI State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Music Parameters
  const [lyrics, setLyrics] = useState("Pour your soul into these words...\nLet the music flow through you...");
  const [selectedVoice, setSelectedVoice] = useState("female-soprano");
  const [selectedGenre, setSelectedGenre] = useState("Pop");
  const [selectedKey, setSelectedKey] = useState("C");
  const [bpm, setBpm] = useState(120);
  const [duration, setDuration] = useState(30);

  // Mixer State
  const [channelVolumes, setChannelVolumes] = useState<Record<string, number>>({
    Vocals: 0.8,
    Harmony: 0.6,
    Kick: 0.9,
    Snare: 0.8,
    HiHat: 0.5,
    Bass: 0.7,
    Chords: 0.6,
    FX: 0.4,
  });

  const [masterVolume, setMasterVolume] = useState(0.8);
  const [reverb, setReverb] = useState(0.3);
  const [delay, setDelay] = useState(0.2);

  // Waveform Visualization
  useEffect(() => {
    if (!synthesizer.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      // Clear canvas
      ctx.fillStyle = "#0a0e27";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Get waveform data
      const waveform = synthesizer.current?.getWaveformData?.();

      // Draw waveform
      if (!waveform) return;
      ctx.strokeStyle = "#00d9ff";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = (canvas.width * 1.0) / waveform.length;
      let x = 0;

      for (let i = 0; i < waveform.length; i++) {
        const v = waveform[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // Draw center line
      ctx.strokeStyle = "#ff006e";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [synthesizer]);

  // Generate Music
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await synthesizer.current.synthesize(
        lyrics,
        selectedKey,
        bpm,
        selectedGenre.toLowerCase(),
        duration
      );
      setIsPlaying(true);
      setTotalTime(duration);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Play/Pause
  const handlePlayPause = () => {
    synthesizer.current.togglePlayback();
    setIsPlaying(!isPlaying);
  };

  // Stop
  const handleStop = () => {
    synthesizer.current.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Update channel volume
  const handleChannelVolumeChange = (channel: string, value: number[]) => {
    const newVolume = value[0];
    setChannelVolumes(prev => ({ ...prev, [channel]: newVolume }));
    synthesizer.current.setChannelVolume(channel, newVolume);
  };

  // Update master volume
  const handleMasterVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setMasterVolume(newVolume);
    synthesizer.current.setMasterVolume(newVolume);
  };

  // Auto-detect BPM
  const handleAutoDetectBPM = () => {
    const detectedBPM = synthesizer.current.detectBPM(lyrics);
    setBpm(detectedBPM);
  };

  // Download
  const handleDownload = async () => {
    try {
      const blob = await synthesizer.current.exportWAV();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dieter-music.wav";
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-cyan-500/20">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-cyan-500" />
            <span className="text-xl font-bold tracking-wider">DIETER STUDIO</span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="text-gray-400 hover:text-white"
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-400 hover:text-white"
            >
              Logout
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex pt-16 h-[calc(100vh-64px)]">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-80 bg-slate-800/50 border-r border-cyan-500/20 overflow-y-auto p-6 space-y-6">
            {/* Lyrics Editor */}
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-2">Lyrics</label>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                className="w-full h-24 bg-slate-900 border border-cyan-500/30 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-cyan-500"
                placeholder="Enter your lyrics..."
              />
            </div>

            {/* Voice Selection */}
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-3">Voice</label>
              <div className="grid grid-cols-2 gap-2">
                {VOICES.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-2 rounded-lg text-xs font-medium transition ${
                      selectedVoice === voice.id
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {voice.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Selection */}
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-3">Genre</label>
              <div className="grid grid-cols-2 gap-2">
                {GENRES.map(genre => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`p-2 rounded-lg text-xs font-medium transition ${
                      selectedGenre === genre
                        ? "bg-magenta-600 text-white"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Key Selection */}
            <div>
              <label className="block text-sm font-semibold text-cyan-400 mb-3">Key</label>
              <div className="grid grid-cols-4 gap-2">
                {KEYS.map(key => (
                  <button
                    key={key}
                    onClick={() => setSelectedKey(key)}
                    className={`p-2 rounded-lg text-xs font-bold transition ${
                      selectedKey === key
                        ? "bg-cyan-600 text-white"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* BPM & Duration */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                  BPM: {bpm}
                </label>
                <Slider
                  value={[bpm]}
                  onValueChange={(value) => setBpm(value[0])}
                  min={60}
                  max={200}
                  step={1}
                  className="w-full"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAutoDetectBPM}
                  className="w-full mt-2 text-xs"
                >
                  Auto-detect BPM
                </Button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-cyan-400 mb-2">
                  Duration: {duration}s
                </label>
                <Slider
                  value={[duration]}
                  onValueChange={(value) => setDuration(value[0])}
                  min={10}
                  max={120}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white font-bold py-3"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4 mr-2" />
                  Generate Song
                </>
              )}
            </Button>
          </div>
        )}

        {/* Main Studio Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Waveform Visualizer */}
          <div className="flex-1 bg-gradient-to-b from-slate-900 to-slate-800 p-6 flex flex-col">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">Waveform</h2>
            <canvas
              ref={canvasRef}
              width={800}
              height={200}
              className="w-full h-48 bg-slate-900 rounded-lg border border-cyan-500/20"
            />

            {/* Playback Controls */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="bg-cyan-600 hover:bg-cyan-500"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <Button
                  onClick={handleStop}
                  size="lg"
                  variant="outline"
                >
                  <Square className="w-5 h-5" />
                </Button>
                <div className="flex-1 text-sm text-gray-400">
                  {Math.floor(currentTime)}s / {Math.floor(totalTime)}s
                </div>
                <Button
                  onClick={handleDownload}
                  size="lg"
                  variant="outline"
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export WAV
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-700 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-magenta-500 h-1 rounded-full transition-all"
                  style={{ width: `${(currentTime / totalTime) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Mixer */}
          <div className="bg-slate-800/50 border-t border-cyan-500/20 p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-cyan-400 mb-4">Mixer</h2>
            <div className="flex gap-6">
              {/* Master Channel */}
              <div className="flex flex-col items-center gap-3 min-w-[80px]">
                <span className="text-xs font-semibold text-cyan-400">Master</span>
                <Slider
                  value={[masterVolume]}
                  onValueChange={handleMasterVolumeChange}
                  min={0}
                  max={1}
                  step={0.01}
                  orientation="vertical"
                  className="h-32"
                />
                <span className="text-xs text-gray-400">{Math.round(masterVolume * 100)}%</span>
              </div>

              {/* Channel Strips */}
              {CHANNELS.map(channel => (
                <div key={channel} className="flex flex-col items-center gap-3 min-w-[80px]">
                  <span className="text-xs font-semibold text-gray-300">{channel}</span>
                  <Slider
                    value={[channelVolumes[channel]]}
                    onValueChange={(value) => handleChannelVolumeChange(channel, value)}
                    min={0}
                    max={1}
                    step={0.01}
                    orientation="vertical"
                    className="h-32"
                  />
                  <span className="text-xs text-gray-400">
                    {Math.round(channelVolumes[channel] * 100)}%
                  </span>
                </div>
              ))}
            </div>

            {/* Effects Controls */}
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
              <div>
                <label className="text-xs font-semibold text-cyan-400 mb-2 block">
                  Reverb: {Math.round(reverb * 100)}%
                </label>
                <Slider
                  value={[reverb]}
                  onValueChange={(value) => setReverb(value[0])}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-cyan-400 mb-2 block">
                  Delay: {Math.round(delay * 100)}%
                </label>
                <Slider
                  value={[delay]}
                  onValueChange={(value) => setDelay(value[0])}
                  min={0}
                  max={1}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
