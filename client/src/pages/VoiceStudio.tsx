import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Music, Play, Square, Volume2, Download, Share2, Loader2,
  Menu, X, Settings, RotateCcw, Zap, Headphones, Library,
  Mic2, Heart, Star, Filter
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function VoiceStudio() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();
  
  // Voice selection
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [playingPreview, setPlayingPreview] = useState<string | null>(null);
  const [favoriteVoices, setFavoriteVoices] = useState<Set<string>>(new Set());
  
  // Filter state
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">("all");
  const [toneFilter, setToneFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  
  // Voice conversion settings
  const [pitchShift, setPitchShift] = useState(0);
  const [timbreShift, setTimbreShift] = useState(0);
  const [emotionIntensity, setEmotionIntensity] = useState(50);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  // Sample voice data
  const voices = [
    {
      id: "v1",
      name: "Aria",
      gender: "female",
      language: "en",
      tone: "soft",
      description: "Smooth and gentle",
      previewUrl: "/previews/aria.mp3",
      rating: 4.8,
      uses: 2341,
    },
    {
      id: "v2",
      name: "Nova",
      gender: "female",
      language: "en",
      tone: "powerful",
      description: "Strong and confident",
      previewUrl: "/previews/nova.mp3",
      rating: 4.9,
      uses: 3421,
    },
    {
      id: "v3",
      name: "Sage",
      gender: "male",
      language: "en",
      tone: "warm",
      description: "Deep and resonant",
      previewUrl: "/previews/sage.mp3",
      rating: 4.7,
      uses: 1923,
    },
    {
      id: "v4",
      name: "Echo",
      gender: "male",
      language: "en",
      tone: "raspy",
      description: "Raw and edgy",
      previewUrl: "/previews/echo.mp3",
      rating: 4.6,
      uses: 1542,
    },
    {
      id: "v5",
      name: "Luna",
      gender: "female",
      language: "es",
      tone: "energetic",
      description: "Vibrant and lively",
      previewUrl: "/previews/luna.mp3",
      rating: 4.8,
      uses: 2156,
    },
    {
      id: "v6",
      name: "Kai",
      gender: "male",
      language: "ja",
      tone: "soft",
      description: "Calm and peaceful",
      previewUrl: "/previews/kai.mp3",
      rating: 4.7,
      uses: 1834,
    },
  ];

  // Filter voices
  const filteredVoices = voices.filter((voice) => {
    if (genderFilter !== "all" && voice.gender !== genderFilter) return false;
    if (toneFilter !== "all" && voice.tone !== toneFilter) return false;
    if (languageFilter !== "all" && voice.language !== languageFilter) return false;
    return true;
  });

  const toggleFavorite = (voiceId: string) => {
    const newFavorites = new Set(favoriteVoices);
    if (newFavorites.has(voiceId)) {
      newFavorites.delete(voiceId);
    } else {
      newFavorites.add(voiceId);
    }
    setFavoriteVoices(newFavorites);
  };

  const playPreview = (voiceId: string) => {
    setPlayingPreview(playingPreview === voiceId ? null : voiceId);
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
              <Mic2 className="w-6 h-6 text-cyan-500" />
              <div>
                <h1 className="text-xl font-bold">Voice Studio</h1>
                <p className="text-xs text-gray-400">RVC v2 Voice Conversion</p>
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
        {/* SIDEBAR - FILTERS & SETTINGS */}
        {sidebarOpen && (
          <div className="w-72 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-cyan-500/20 overflow-y-auto p-6 space-y-6">
            {/* FILTERS */}
            <div>
              <h3 className="text-sm font-semibold text-cyan-500 mb-4">Filters</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-2">Gender</label>
                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white/5 border border-cyan-500/20 rounded text-sm text-white"
                  >
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">Tone</label>
                  <select
                    value={toneFilter}
                    onChange={(e) => setToneFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-cyan-500/20 rounded text-sm text-white"
                  >
                    <option value="all">All</option>
                    <option value="soft">Soft</option>
                    <option value="powerful">Powerful</option>
                    <option value="warm">Warm</option>
                    <option value="raspy">Raspy</option>
                    <option value="energetic">Energetic</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 block mb-2">Language</label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-cyan-500/20 rounded text-sm text-white"
                  >
                    <option value="all">All</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>
            </div>

            {/* VOICE CONVERSION SETTINGS */}
            {selectedVoice && (
              <div>
                <h3 className="text-sm font-semibold text-cyan-500 mb-4">Voice Conversion</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-2">
                      Pitch Shift: {pitchShift > 0 ? "+" : ""}{pitchShift}
                    </label>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      value={pitchShift}
                      onChange={(e) => setPitchShift(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-2">
                      Timbre Shift: {timbreShift}%
                    </label>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={timbreShift}
                      onChange={(e) => setTimbreShift(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-2">
                      Emotion Intensity: {emotionIntensity}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={emotionIntensity}
                      onChange={(e) => setEmotionIntensity(Number(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* FAVORITES */}
            <div>
              <h3 className="text-sm font-semibold text-cyan-500 mb-4">Favorites</h3>
              <div className="space-y-2">
                {voices
                  .filter((v) => favoriteVoices.has(v.id))
                  .map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`p-2 rounded cursor-pointer transition ${
                        selectedVoice === voice.id
                          ? "bg-cyan-500/30 border border-cyan-500"
                          : "bg-white/5 border border-cyan-500/20 hover:border-cyan-500/40"
                      }`}
                    >
                      <div className="text-sm font-medium">{voice.name}</div>
                      <div className="text-xs text-gray-400">{voice.tone}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT - VOICE GRID */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">
                  Available Voices ({filteredVoices.length})
                </h2>
                <p className="text-gray-400">
                  Select a voice and customize with RVC v2 voice conversion
                </p>
              </div>

              {/* VOICE GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVoices.map((voice) => (
                  <div
                    key={voice.id}
                    onClick={() => setSelectedVoice(voice.id)}
                    className={`p-6 rounded-lg border-2 transition cursor-pointer ${
                      selectedVoice === voice.id
                        ? "bg-cyan-500/20 border-cyan-500"
                        : "bg-white/5 border-cyan-500/20 hover:border-cyan-500/40"
                    }`}
                  >
                    {/* VOICE HEADER */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{voice.name}</h3>
                        <p className="text-sm text-gray-400">{voice.description}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(voice.id);
                        }}
                        className={`p-2 rounded transition ${
                          favoriteVoices.has(voice.id)
                            ? "text-red-500 bg-red-500/20"
                            : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                        }`}
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>

                    {/* VOICE INFO */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                      <div>
                        <span className="text-gray-500">Gender:</span>
                        <span className="text-white ml-1 capitalize">{voice.gender}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Tone:</span>
                        <span className="text-white ml-1 capitalize">{voice.tone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Language:</span>
                        <span className="text-white ml-1 uppercase">{voice.language}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Rating:</span>
                        <span className="text-cyan-400 ml-1">⭐ {voice.rating}</span>
                      </div>
                    </div>

                    {/* PREVIEW BUTTON */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playPreview(voice.id);
                      }}
                      className="w-full py-2 px-4 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition flex items-center justify-center gap-2 mb-3"
                    >
                      {playingPreview === voice.id ? (
                        <>
                          <Square className="w-4 h-4" />
                          Stop Preview
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Preview (5s)
                        </>
                      )}
                    </button>

                    {/* USE VOICE BUTTON */}
                    {selectedVoice === voice.id && (
                      <button className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-500 rounded-lg transition">
                        Use This Voice
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BOTTOM ACTION BAR */}
          {selectedVoice && (
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-t border-cyan-500/20 p-6 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Selected: {voices.find((v) => v.id === selectedVoice)?.name}
              </div>
              <div className="flex gap-3">
                <Button className="bg-cyan-600 hover:bg-cyan-500">
                  <Headphones className="w-4 h-4 mr-2" />
                  Test Voice
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-500">
                  <Download className="w-4 h-4 mr-2" />
                  Apply to Track
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
