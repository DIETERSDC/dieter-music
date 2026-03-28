import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Music, Download, Play, Square, Volume2, Sliders, Activity,
  Save, Share2, Loader2, Menu, X, Settings, RotateCcw, Zap,
  Headphones, Library, Mic2, Drum, Radio, Maximize2, Minimize2, Waves
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";

export default function DAWStudio() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  
  // Mixer state
  const [vocalsVolume, setVocalsVolume] = useState(100);
  const [drumsVolume, setDrumsVolume] = useState(100);
  const [bassVolume, setBassVolume] = useState(100);
  const [otherVolume, setOtherVolume] = useState(100);
  
  // Track mute/solo
  const [mutedTracks, setMutedTracks] = useState<Set<string>>(new Set());
  const [soloTrack, setSoloTrack] = useState<string | null>(null);
  
  // Effects state
  const [reverbMix, setReverbMix] = useState(30);
  const [compressionRatio, setCompressionRatio] = useState(4);
  const [eqBass, setEqBass] = useState(0);
  const [eqMid, setEqMid] = useState(0);
  const [eqTreble, setEqTreble] = useState(0);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fullscreenWaveform, setFullscreenWaveform] = useState(false);
  const [activeTab, setActiveTab] = useState<"mixer" | "effects" | "library">("mixer");
  
  // Track data
  const [tracks] = useState([
    { id: "vocals", name: "Vocals", color: "from-cyan-500 to-blue-500", icon: Mic2 },
    { id: "drums", name: "Drums", color: "from-purple-500 to-pink-500", icon: Drum },
    { id: "bass", name: "Bass", color: "from-orange-500 to-red-500", icon: Waves },
    { id: "other", name: "Other", color: "from-green-500 to-emerald-500", icon: Radio },
  ]);

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleTrackMute = (trackId: string) => {
    const newMuted = new Set(mutedTracks);
    if (newMuted.has(trackId)) {
      newMuted.delete(trackId);
    } else {
      newMuted.add(trackId);
    }
    setMutedTracks(newMuted);
  };

  const toggleTrackSolo = (trackId: string) => {
    setSoloTrack(soloTrack === trackId ? null : trackId);
  };

  const getTrackVolume = (trackId: string) => {
    switch (trackId) {
      case "vocals": return vocalsVolume;
      case "drums": return drumsVolume;
      case "bass": return bassVolume;
      case "other": return otherVolume;
      default: return 100;
    }
  };

  const setTrackVolume = (trackId: string, value: number) => {
    switch (trackId) {
      case "vocals": setVocalsVolume(value); break;
      case "drums": setDrumsVolume(value); break;
      case "bass": setBassVolume(value); break;
      case "other": setOtherVolume(value); break;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden flex flex-col">
      {/* TOP HEADER */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <Music className="w-6 h-6 text-cyan-500" />
              <div>
                <h1 className="text-xl font-bold">Dieter DAW Studio</h1>
                <p className="text-xs text-gray-400">Professional Audio Workstation</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{user?.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="text-gray-400 hover:text-white"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR */}
        {sidebarOpen && (
          <div className="w-80 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-cyan-500/20 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex gap-2 border-b border-cyan-500/20">
                {(["mixer", "effects", "library"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab
                        ? "text-cyan-500 border-b-2 border-cyan-500"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* MIXER TAB */}
              {activeTab === "mixer" && (
                <div className="space-y-6">
                  <div className="text-sm font-semibold text-cyan-500">Master Volume</div>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vocalsVolume}
                      onChange={(e) => setVocalsVolume(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-400">{vocalsVolume}%</div>
                  </div>

                  <div className="space-y-4">
                    {tracks.map((track) => (
                      <div
                        key={track.id}
                        className="p-3 rounded-lg bg-white/5 border border-cyan-500/20 hover:border-cyan-500/40 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <track.icon className="w-4 h-4 text-cyan-500" />
                            <span className="text-sm font-medium">{track.name}</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => toggleTrackMute(track.id)}
                              className={`p-1 rounded transition ${
                                mutedTracks.has(track.id)
                                  ? "bg-red-500/30 text-red-400"
                                  : "hover:bg-white/10 text-gray-400"
                              }`}
                              title="Mute"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => toggleTrackSolo(track.id)}
                              className={`p-1 rounded transition ${
                                soloTrack === track.id
                                  ? "bg-cyan-500/30 text-cyan-400"
                                  : "hover:bg-white/10 text-gray-400"
                              }`}
                              title="Solo"
                            >
                              <Headphones className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={getTrackVolume(track.id)}
                          onChange={(e) => setTrackVolume(track.id, Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="text-xs text-gray-400 mt-1">
                          {getTrackVolume(track.id)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EFFECTS TAB */}
              {activeTab === "effects" && (
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold text-cyan-500 block mb-2">
                      Reverb Mix
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={reverbMix}
                      onChange={(e) => setReverbMix(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-400 mt-1">{reverbMix}%</div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-cyan-500 block mb-2">
                      Compression Ratio
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={compressionRatio}
                      onChange={(e) => setCompressionRatio(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-400 mt-1">{compressionRatio}:1</div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-cyan-500">EQ</label>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Bass</div>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        value={eqBass}
                        onChange={(e) => setEqBass(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-gray-400 mt-1">{eqBass > 0 ? "+" : ""}{eqBass}dB</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Mid</div>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        value={eqMid}
                        onChange={(e) => setEqMid(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-gray-400 mt-1">{eqMid > 0 ? "+" : ""}{eqMid}dB</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Treble</div>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        value={eqTreble}
                        onChange={(e) => setEqTreble(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-xs text-gray-400 mt-1">{eqTreble > 0 ? "+" : ""}{eqTreble}dB</div>
                    </div>
                  </div>
                </div>
              )}

              {/* LIBRARY TAB */}
              {activeTab === "library" && (
                <div className="space-y-4">
                  <div className="text-sm text-gray-400">Recent Tracks</div>
                  <div className="space-y-2">
                    {["Track 1", "Track 2", "Track 3"].map((track) => (
                      <div
                        key={track}
                        className="p-2 rounded bg-white/5 border border-cyan-500/20 hover:border-cyan-500/40 cursor-pointer transition"
                      >
                        <div className="text-sm font-medium">{track}</div>
                        <div className="text-xs text-gray-400">3:45</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* WAVEFORM AREA */}
          <div className={`${fullscreenWaveform ? "flex-1" : "flex-1"} bg-gradient-to-b from-slate-900 to-slate-950 border-b border-cyan-500/20 flex flex-col`}>
            <div className="flex-1 flex items-center justify-center relative overflow-hidden">
              {/* Waveform Visualization */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-900/50 to-black/50">
                <div className="text-center">
                  <Activity className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Waveform Display</p>
                  <p className="text-gray-600 text-xs mt-2">WaveSurfer.js Integration</p>
                </div>
              </div>

              {/* Playback Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition"
                  >
                    {isPlaying ? (
                      <Square className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={handleStop}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 flex-1 mx-4">
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => setCurrentTime(Number(e.target.value))}
                    className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs text-gray-400 whitespace-nowrap">{formatTime(duration)}</span>
                </div>

                <button
                  onClick={() => setFullscreenWaveform(!fullscreenWaveform)}
                  className="p-2 hover:bg-white/10 rounded-lg transition"
                >
                  {fullscreenWaveform ? (
                    <Minimize2 className="w-5 h-5" />
                  ) : (
                    <Maximize2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* BOTTOM CONTROLS */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-cyan-500/20 p-6 flex justify-between items-center">
            <div className="flex gap-3">
              <Button className="bg-orange-600 hover:bg-orange-500">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button className="bg-cyan-600 hover:bg-cyan-500">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" className="border-cyan-500/50">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="text-sm text-gray-400">
              {isPlaying ? "🎵 Playing" : "⏸️ Paused"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
