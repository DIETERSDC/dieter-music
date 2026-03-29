import { useState } from "react";
import { Music, Zap, Mic, Settings, Plus, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";

export default function MurekaStudio() {
  const { user } = useAuth();
  const [mode, setMode] = useState<"easy" | "custom">("easy");
  const [lyrics, setLyrics] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [vocalGender, setVocalGender] = useState<"female" | "male">("female");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [instrumental, setInstrumental] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const styles = ["Sultry", "Latin Trap", "Slow Jam", "Electro"];

  const handleCreate = async () => {
    if (!lyrics.trim() || !songTitle.trim()) {
      alert("Please enter lyrics and a song title");
      return;
    }

    setIsGenerating(true);
    try {
      // Call backend API
      const response = await fetch("/api/trpc/studio.generateSong", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lyrics,
          songTitle,
          vocalGender,
          style: selectedStyle || "Sultry",
          instrumental,
        }),
      });

      if (response.ok) {
        alert("Song generated successfully!");
        setLyrics("");
        setSongTitle("");
      }
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate song");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-slate-950/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">DIETER</h1>
          </div>
          <div className="text-sm text-purple-300">
            {user?.name || "Creator"}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 gap-8">
          {/* LEFT PANEL - Input */}
          <div className="space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-2 bg-slate-900/50 p-1 rounded-lg border border-purple-500/20">
              <button
                onClick={() => setMode("easy")}
                className={`flex-1 py-2 px-4 rounded transition ${
                  mode === "easy"
                    ? "bg-purple-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Easy
              </button>
              <button
                onClick={() => setMode("custom")}
                className={`flex-1 py-2 px-4 rounded transition ${
                  mode === "custom"
                    ? "bg-purple-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Custom
              </button>
            </div>

            {/* Reference/Remix/Vocal Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 px-4 bg-slate-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/50 transition text-slate-300 hover:text-white flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Reference
              </button>
              <button className="flex-1 py-3 px-4 bg-slate-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/50 transition text-slate-300 hover:text-white flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Remix
              </button>
              <button className="flex-1 py-3 px-4 bg-slate-900/50 border border-purple-500/20 rounded-lg hover:border-purple-500/50 transition text-slate-300 hover:text-white flex items-center justify-center gap-2 relative">
                <Mic className="w-4 h-4" />
                Vocal
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  New
                </span>
              </button>
            </div>

            {/* Song Title */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Song Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={songTitle}
                  onChange={(e) =>
                    setSongTitle(e.target.value.slice(0, 50))
                  }
                  placeholder="Enter song title..."
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
                />
                <span className="absolute right-3 top-3 text-xs text-slate-500">
                  {songTitle.length}/50
                </span>
              </div>
            </div>

            {/* Lyrics Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm text-slate-400">Lyrics</label>
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={instrumental}
                    onChange={(e) => setInstrumental(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Instrumental
                </label>
              </div>
              <textarea
                value={lyrics}
                onChange={(e) => setLyrics(e.target.value)}
                placeholder="Pour your soul into these words..."
                className="w-full h-64 px-4 py-3 bg-slate-900/50 border border-purple-500/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
              />
            </div>

            {/* Vocal Gender Selector */}
            <div>
              <label className="block text-sm text-slate-400 mb-3">
                Vocal Gender
              </label>
              <div className="flex gap-4">
                {["female", "male"].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => setVocalGender(gender as "female" | "male")}
                    className={`flex-1 py-3 px-4 rounded-lg transition border-b-2 ${
                      vocalGender === gender
                        ? "border-purple-500 text-purple-400"
                        : "border-transparent text-slate-400 hover:text-white"
                    }`}
                  >
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Tags */}
            <div>
              <label className="block text-sm text-slate-400 mb-3">
                Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() =>
                      setSelectedStyle(
                        selectedStyle === style ? null : style
                      )
                    }
                    className={`py-2 px-3 rounded-lg transition text-sm ${
                      selectedStyle === style
                        ? "bg-purple-600 text-white"
                        : "bg-slate-900/50 border border-purple-500/20 text-slate-300 hover:text-white"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <Button
              onClick={handleCreate}
              disabled={isGenerating || !lyrics.trim() || !songTitle.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
            >
              {isGenerating ? "Creating..." : "Create Song"}
            </Button>
          </div>

          {/* RIGHT PANEL - Output/Preview */}
          <div className="space-y-6">
            {/* Empty State */}
            {!lyrics && (
              <div className="h-96 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-purple-500/30 bg-gradient-to-br from-purple-950/20 to-slate-950/20">
                <div className="relative mb-4">
                  <Music className="w-16 h-16 text-purple-400/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl -z-10" />
                </div>
                <p className="text-slate-400 text-center max-w-xs">
                  Start creating your masterpiece. Write your lyrics and let the
                  alchemy begin.
                </p>
              </div>
            )}

            {/* Generated Song Preview */}
            {lyrics && (
              <div className="space-y-4">
                <div className="p-6 rounded-lg bg-slate-900/50 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {songTitle || "Untitled Song"}
                  </h3>

                  {/* Waveform Placeholder */}
                  <div className="h-24 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg flex items-center justify-center mb-4">
                    <div className="flex gap-1 items-end">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                          style={{
                            height: `${Math.random() * 80 + 20}%`,
                            animation: `pulse ${0.5 + Math.random() * 0.5}s infinite`,
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div className="flex items-center gap-4">
                    <button className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center transition">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </button>
                    <div className="flex-1">
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-0 bg-gradient-to-r from-purple-500 to-pink-500" />
                      </div>
                    </div>
                    <span className="text-sm text-slate-400">0:00 / 3:00</span>
                  </div>
                </div>

                {/* Song Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900/50 border border-purple-500/20">
                    <p className="text-xs text-slate-500 mb-1">Gender</p>
                    <p className="text-white font-semibold capitalize">
                      {vocalGender}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900/50 border border-purple-500/20">
                    <p className="text-xs text-slate-500 mb-1">Style</p>
                    <p className="text-white font-semibold">
                      {selectedStyle || "Default"}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <Button className="w-full py-3 bg-slate-900/50 border border-purple-500/20 hover:border-purple-500/50 text-white rounded-lg transition">
                  <Plus className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
