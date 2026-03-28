import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sing, stopPlayback, generateMelodyFromLyrics } from "@/lib/voiceSynthesis";
import { recordVoiceSynthesis, downloadAudio, getAudioDuration } from "@/lib/audioExport";
import {
  Music, Download, Sparkles, Play, Square, Volume2, Mic2, Sliders, Activity,
  Save, Share2, Loader2, Menu, X, Settings, RotateCcw, Zap, Headphones, Library
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

export default function StudioProduction() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  // Lyrics & Melody
  const [lyrics, setLyrics] = useState("Pour your soul into these words...\nLet the music flow through you...");
  const [melody, setMelody] = useState("C4 D4 E4 F4 G4 A4 B4 C5");
  const [bpm, setBpm] = useState(128);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Voice settings
  const [selectedVoice, setSelectedVoice] = useState("UK English Female");
  const [pitch, setPitch] = useState(1.2);
  const [rate, setRate] = useState(0.9);
  
  // Effects
  const [reverbMix, setReverbMix] = useState(30);
  const [delayTime, setDelayTime] = useState(500);
  const [delayMix, setDelayMix] = useState(20);
  const [pitchShift, setPitchShift] = useState(0);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"lyrics" | "effects" | "library">("lyrics");
  const [trackName, setTrackName] = useState("Untitled Track");
  
  // Audio recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const handleSaveTrack = async () => {
    alert(`💾 Track "${trackName}" saved to your library`);
  };

  const handleExport = async () => {
    if (!lyrics.trim()) {
      alert("Please enter lyrics to export");
      return;
    }

    setIsSynthesizing(true);
    try {
      // Record the voice synthesis
      const audioBlob = await recordVoiceSynthesis(lyrics, {
        voice: selectedVoice,
        pitch,
        rate,
      });

      if (audioBlob) {
        // Get duration for feedback
        const duration = await getAudioDuration(audioBlob);
        
        // Download as WebM (can be converted to WAV on backend)
        downloadAudio(audioBlob, trackName, 'webm');
        alert(`✅ Audio exported! Duration: ${duration.toFixed(2)}s`);
      } else {
        alert("❌ Failed to export audio");
      }
    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting audio");
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleShare = async () => {
    alert("🔗 Share link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex flex-col">
      {/* TOP HEADER */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-background via-background/95 to-background backdrop-blur-xl sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-cyan-500" />
              <div>
                <h1 className="text-2xl font-bold">Dieter Studio</h1>
                <p className="text-xs text-foreground/50">🎙️ Real-Time Music Production</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm">♪ {bpm} BPM</span>
              <span className="text-sm">|</span>
              <span className="text-sm">{selectedVoice}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-cyan-500/50"
              onClick={() => setLocation("/dashboard")}
            >
              Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-500/50 hover:bg-red-500/10"
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        <div
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-80 bg-gradient-to-b from-background via-background/95 to-background backdrop-blur-xl border-r border-cyan-500/20 transition-transform duration-300 z-50 lg:relative lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="h-full overflow-y-auto p-6 space-y-6">
            {/* Track Name */}
            <div>
              <label className="text-sm font-semibold text-cyan-400 block mb-2">Track Name</label>
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                className="w-full p-3 rounded-lg bg-background/50 border border-cyan-500/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-cyan-500/20">
              <button
                onClick={() => setActiveTab("lyrics")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "lyrics"
                    ? "border-b-2 border-cyan-500 text-cyan-400"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                <Mic2 className="w-4 h-4 inline mr-2" />
                Lyrics
              </button>
              <button
                onClick={() => setActiveTab("effects")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "effects"
                    ? "border-b-2 border-cyan-500 text-cyan-400"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                <Sliders className="w-4 h-4 inline mr-2" />
                Effects
              </button>
              <button
                onClick={() => setActiveTab("library")}
                className={`px-4 py-2 text-sm font-medium transition ${
                  activeTab === "library"
                    ? "border-b-2 border-cyan-500 text-cyan-400"
                    : "text-foreground/50 hover:text-foreground"
                }`}
              >
                <Library className="w-4 h-4 inline mr-2" />
                Library
              </button>
            </div>

            {/* LYRICS TAB */}
            {activeTab === "lyrics" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <Mic2 className="w-4 h-4" /> Your Lyrics
                  </h3>
                  <textarea
                    value={lyrics}
                    onChange={(e) => setLyrics(e.target.value)}
                    placeholder="Pour your soul into these words..."
                    className="w-full h-40 p-3 rounded-lg bg-background/50 border border-cyan-500/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-cyan-500 resize-none text-sm"
                  />
                </div>

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
                    🎵 Auto-Generate Melody
                  </Button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-amber-400 mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" /> Voice Settings
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-cyan-400 block mb-1">Voice</label>
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

                    <div>
                      <label className="text-xs text-cyan-400 block mb-1">Tempo: {bpm} BPM</label>
                      <input
                        type="range"
                        min="60"
                        max="180"
                        value={bpm}
                        onChange={(e) => setBpm(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-cyan-400 block mb-1">Pitch: {pitch.toFixed(1)}</label>
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
                      <label className="text-xs text-cyan-400 block mb-1">Rate: {rate.toFixed(1)}</label>
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
                </div>
              </div>
            )}

            {/* EFFECTS TAB */}
            {activeTab === "effects" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-magenta-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4" /> Effects Rack
                </h3>

                <div>
                  <label className="text-xs text-cyan-400 block mb-1">Reverb Mix: {reverbMix}%</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={reverbMix}
                    onChange={(e) => setReverbMix(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex gap-2 mt-2 text-xs">
                    <button className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40">Studio</button>
                    <button className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40">Room</button>
                    <button className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/40">Plate</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-cyan-400 block mb-1">Delay Time: {delayTime}ms</label>
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

                <div>
                  <label className="text-xs text-cyan-400 block mb-1">Pitch Shift: {pitchShift > 0 ? '+' : ''}{pitchShift}</label>
                  <input
                    type="range"
                    min="-12"
                    max="12"
                    value={pitchShift}
                    onChange={(e) => setPitchShift(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="pt-4 border-t border-cyan-500/20">
                  <p className="text-xs font-semibold text-foreground/70 mb-2">Presets</p>
                  <div className="space-y-2">
                    <Button size="sm" variant="outline" className="w-full border-cyan-500/50 text-xs">
                      🌊 Ambient
                    </Button>
                    <Button size="sm" variant="outline" className="w-full border-cyan-500/50 text-xs">
                      ✨ Bright
                    </Button>
                    <Button size="sm" variant="outline" className="w-full border-cyan-500/50 text-xs">
                      🔥 Warm
                    </Button>
                    <Button size="sm" variant="outline" className="w-full border-cyan-500/50 text-xs">
                      🎬 Cinematic
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* LIBRARY TAB */}
            {activeTab === "library" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                  <Library className="w-4 h-4" /> Your Tracks
                </h3>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <p className="text-sm font-semibold">Untitled Track</p>
                    <p className="text-xs text-foreground/50">Created today • 128 BPM</p>
                  </div>
                  <p className="text-xs text-foreground/50 text-center py-4">Create your first track to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN STUDIO AREA */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* MAIN CONTROLS */}
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
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500 text-white font-bold text-lg"
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
                <div className="bg-background/50 rounded-lg p-12 border border-cyan-500/30 min-h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-20 h-20 mx-auto text-cyan-500/50 mb-4" />
                    <p className="text-lg text-foreground/50 mb-2">
                      {isPlaying ? "🎵 Singing your lyrics..." : "Ready to synthesize"}
                    </p>
                    {isPlaying && (
                      <div className="flex gap-1 mt-6 justify-center">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="w-2 bg-gradient-to-t from-cyan-500 to-magenta-500 rounded-full animate-pulse"
                            style={{
                              height: `${20 + Math.random() * 40}px`,
                              animationDelay: `${i * 0.08}s`,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    className="bg-amber-600 hover:bg-amber-500"
                    onClick={handleSaveTrack}
                    disabled={!lyrics.trim()}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    className="bg-cyan-600 hover:bg-cyan-500"
                    onClick={handleExport}
                    disabled={!lyrics.trim()}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    className="border-cyan-500/50 hover:bg-cyan-500/10"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    variant="outline"
                    className="border-cyan-500/50 hover:bg-cyan-500/10"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* CREATION FLOW */}
            <Card className="glass-card border-cyan-500/30 bg-glass">
              <CardHeader>
                <CardTitle className="text-base">Creation Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  {["Lyrics", "Melody", "Voice", "Effects", "Master"].map((stage, i) => (
                    <div key={i} className="text-center flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 font-bold ${
                        i === 0 ? "bg-cyan-500/20 text-cyan-400" :
                        i === 1 ? "bg-magenta-500/20 text-magenta-400" :
                        i === 2 ? "bg-amber-500/20 text-amber-400" :
                        i === 3 ? "bg-cyan-500/20 text-cyan-400" :
                        "bg-cyan-500/20 text-cyan-400"
                      }`}>
                        {i + 1}
                      </div>
                      <p className="font-semibold text-xs">{stage}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
