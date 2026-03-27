import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sing, stopPlayback, generateMelodyFromLyrics } from "@/lib/voiceSynthesis";
import {
  Music, Zap, Headphones, Download, Sparkles, Play, Square, Settings, Volume2,
  Mic2, Sliders, Activity, Save, Share2, Loader2, RotateCcw, Menu, X
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

export default function StudioEnhanced() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [lyrics, setLyrics] = useState("Pour your soul into these words...\nLet the music flow through you...");
  const [melody, setMelody] = useState("C4 D4 E4 F4 G4 A4 B4 C5");
  const [bpm, setBpm] = useState(128);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState("UK English Female");
  const [pitch, setPitch] = useState(1.2);
  const [rate, setRate] = useState(0.9);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Effects
  const [reverbMix, setReverbMix] = useState(30);
  const [delayTime, setDelayTime] = useState(500);
  const [delayMix, setDelayMix] = useState(20);
  const [pitchShift, setPitchShift] = useState(0);
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handleSing = async () => {
    if (!lyrics.trim()) {
      alert("Please enter lyrics to sing");
      return;
    }

    setIsSynthesizing(true);
    setIsPlaying(true);

    try {
      const generatedMelody = melody || generateMelodyFromLyrics(lyrics, bpm);
      
      await sing({
        lyrics,
        melody: generatedMelody,
        voice: selectedVoice,
        pitch,
        rate,
      });
    } catch (error) {
      console.error("Singing error:", error);
      alert("Error during voice synthesis");
    } finally {
      setIsSynthesizing(false);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    stopPlayback();
    setIsPlaying(false);
  };

  const handleGenerateMelody = () => {
    if (lyrics.trim()) {
      const generated = generateMelodyFromLyrics(lyrics, bpm);
      setMelody(generated);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex">
      {/* SIDEBAR */}
      <div
        className={`fixed left-0 top-0 h-screen w-80 bg-gradient-to-b from-background via-background/95 to-background backdrop-blur-xl border-r border-cyan-500/20 transition-transform duration-300 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-pink-600 bg-clip-text text-transparent">
                Pure Sound
              </h2>
              <p className="text-xs text-foreground/50 mt-1">Your Lyrics</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lyrics Input */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Mic2 className="w-4 h-4" /> Lyrics
            </h3>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Pour your soul into these words..."
              className="w-full h-40 p-3 rounded-lg bg-background/50 border border-cyan-500/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-cyan-500 resize-none text-sm"
            />
          </div>

          {/* Melody Input */}
          <div>
            <h3 className="text-sm font-semibold text-magenta-400 mb-3 flex items-center gap-2">
              <Music className="w-4 h-4" /> Melody
            </h3>
            <input
              type="text"
              value={melody}
              onChange={(e) => setMelody(e.target.value)}
              placeholder="C4 D4 E4 F4 G4..."
              className="w-full p-2 rounded-lg bg-background/50 border border-cyan-500/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-cyan-500 text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              className="w-full mt-2 border-cyan-500/50 hover:bg-cyan-500/10 text-xs"
              onClick={handleGenerateMelody}
            >
              🎵 Auto-Generate
            </Button>
          </div>

          {/* Voice Selection */}
          <div>
            <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
              <Volume2 className="w-4 h-4" /> Voice
            </h3>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full p-2 rounded-lg bg-background/50 border border-cyan-500/30 text-foreground focus:outline-none focus:border-cyan-500 text-sm"
            >
              <option>UK English Female</option>
              <option>US English Female</option>
              <option>US English Male</option>
              <option>Australian Female</option>
              <option>Indian Female</option>
            </select>
          </div>

          {/* BPM */}
          <div>
            <label className="text-sm font-semibold text-cyan-400 block mb-2">
              Tempo: {bpm} BPM
            </label>
            <input
              type="range"
              min="60"
              max="180"
              value={bpm}
              onChange={(e) => setBpm(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Pitch & Rate */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-cyan-400 block mb-2">
                Pitch: {pitch.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-cyan-400 block mb-2">
                Rate: {rate.toFixed(1)}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Effects Section */}
          <div className="pt-4 border-t border-cyan-500/20">
            <h3 className="text-sm font-semibold text-magenta-400 mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Effects
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-cyan-400 block mb-1">Reverb: {reverbMix}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={reverbMix}
                  onChange={(e) => setReverbMix(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-cyan-400 block mb-1">Delay: {delayTime}ms</label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={delayTime}
                  onChange={(e) => setDelayTime(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-xs text-cyan-400 block mb-1">Delay Mix: {delayMix}%</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={delayMix}
                  onChange={(e) => setDelayMix(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "lg:ml-80" : ""}`}>
        {/* Header */}
        <div className="border-b border-cyan-500/30 bg-glass-card/50 backdrop-blur-xl sticky top-0 z-40">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <Music className="w-8 h-8 text-cyan-500" />
                <div>
                  <h1 className="text-2xl font-bold">Dieter Studio</h1>
                  <p className="text-xs text-foreground/50">🎙️ Real Voice Synthesis Enabled</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm">♪ {bpm} BPM</span>
              <Button 
                variant="outline" 
                size="sm"
                className="border-cyan-500/50"
                onClick={() => setLocation("/dashboard")}
              >
                Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Main Studio Area */}
        <div className="p-6 space-y-6">
          {/* Main Control Card */}
          <Card className="glass-card border-cyan-500/30 bg-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Birth Your Masterpiece
              </CardTitle>
              <CardDescription>Synthesize real singing from your lyrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Play/Stop Controls */}
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white font-bold"
                  onClick={handleSing}
                  disabled={isSynthesizing || !lyrics.trim()}
                >
                  {isSynthesizing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Synthesizing...
                    </>
                  ) : isPlaying ? (
                    <>
                      <Play className="w-5 h-5 mr-2" />
                      Playing...
                    </>
                  ) : (
                    <>
                      <Music className="w-5 h-5 mr-2" />
                      🎤 Sing Now
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-cyan-500/50 hover:bg-cyan-500/10"
                  onClick={handleStop}
                  disabled={!isPlaying}
                >
                  <Square className="w-5 h-5" />
                </Button>
              </div>

              {/* Waveform Visualization */}
              <div className="bg-background/50 rounded-lg p-8 border border-cyan-500/30 min-h-40 flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-16 h-16 mx-auto text-cyan-500/50 mb-3" />
                  <p className="text-sm text-foreground/50">
                    {isPlaying ? "🎵 Singing your lyrics..." : "Ready to synthesize"}
                  </p>
                  {isPlaying && (
                    <div className="flex gap-1 mt-4 justify-center">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-cyan-500 rounded-full animate-pulse"
                          style={{
                            height: `${20 + Math.random() * 30}px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Download & Share */}
              <div className="flex gap-3">
                <Button
                  className="flex-1 bg-amber-600 hover:bg-amber-500"
                  onClick={() => alert("💾 Track saved to your library")}
                  disabled={!lyrics.trim()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Save Track
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-cyan-500/50 hover:bg-cyan-500/10"
                  onClick={() => alert("🔗 Share link copied")}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Creation Flow */}
          <Card className="glass-card border-cyan-500/30 bg-glass">
            <CardHeader>
              <CardTitle className="text-base">Creation Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                {["Lyrics", "Melody", "Voice", "Effects", "Master"].map((stage, i) => (
                  <div key={i} className="text-center flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 ${
                      i === 0 ? "bg-cyan-500/20" :
                      i === 1 ? "bg-magenta-500/20" :
                      i === 2 ? "bg-amber-500/20" :
                      i === 3 ? "bg-cyan-500/20" :
                      "bg-cyan-500/20"
                    }`}>
                      {i + 1}
                    </div>
                    <p className="font-semibold text-xs">{stage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Preset Effects */}
          <Card className="glass-card border-cyan-500/30 bg-glass">
            <CardHeader>
              <CardTitle className="text-base">Effect Presets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button size="sm" variant="outline" className="border-cyan-500/50 text-xs">
                  🌊 Ambient
                </Button>
                <Button size="sm" variant="outline" className="border-cyan-500/50 text-xs">
                  ✨ Bright
                </Button>
                <Button size="sm" variant="outline" className="border-cyan-500/50 text-xs">
                  🔥 Warm
                </Button>
                <Button size="sm" variant="outline" className="border-cyan-500/50 text-xs">
                  🎬 Cinematic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
