import { useState, useRef, useEffect } from "react";
import { Music, Sparkles, X, Play, Download, Zap } from "lucide-react";
import * as Tone from "tone";

/**
 * DIETER STUDIO EDITOR
 * Design Philosophy: Neo-Noir Analog Sanctuary
 * - Sidebar-based lyrics input with glassmorphism
 * - Flow visualization showing creation pipeline
 * - Audio synthesis with Tone.js (85 BPM heartbeat)
 * - Organic animations and tube-glow accents
 */

const flowStages = ["Lyrics", "Melody", "Voice", "Mix", "Vision"];

export default function Studio() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lyrics, setLyrics] = useState(
    `Words carry the soul of music...
Pour your passion here—raw, unfiltered, alive.

[Verse]
In the quiet spaces between heartbeats
Where shadows dance with golden light...

[Chorus]
We rise, we fall, we become the sound...`
  );
  const [currentFlow, setCurrentFlow] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [showDownloads, setShowDownloads] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const synthRef = useRef<Tone.Synth | null>(null);

  // Initialize audio context on first interaction
  const initAudio = async () => {
    if (!synthRef.current) {
      await Tone.start();
      synthRef.current = new Tone.Synth({
        oscillator: { type: "triangle" },
        envelope: {
          attack: 0.005,
          decay: 0.1,
          sustain: 0.3,
          release: 1,
        },
      }).toDestination();
    }
  };

  // Birth Masterpiece - orchestrate the creation flow
  const birthMasterpiece = async () => {
    if (!lyrics.trim()) {
      alert("Please pour your soul into lyrics first...");
      return;
    }

    await initAudio();
    setIsCreating(true);
    setShowDownloads(false);

    // Flow through creation stages
    for (let i = 0; i < flowStages.length; i++) {
      setCurrentFlow(i);
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));

      // Invoke spirits based on stage
      switch (i) {
        case 0: // Lyrics
          analyzeSoul(lyrics);
          break;
        case 1: // Melody
          await birthMelody();
          break;
        case 2: // Voice
          await summonVoice();
          break;
        case 3: // Mix
          harmonizeElements();
          break;
        case 4: // Vision
          paintVision();
          break;
      }
    }

    setIsCreating(false);
    setShowDownloads(true);
    setCurrentFlow(-1);
  };

  // Analyze the soul of lyrics
  const analyzeSoul = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim());
    const emotion = text.toLowerCase().includes("light") ? "hopeful" : "passionate";
    console.log("Soul Analysis:", {
      lines: lines.length,
      emotion,
      culture: "universal",
      meter: "4/4 soul",
    });
  };

  // Birth organic melody with Tone.js
  const birthMelody = async () => {
    if (!synthRef.current) return;

    const melody = ["C4", "E4", "G4", "C5", "B4", "G4", "E4", "C4"];
    const now = Tone.now();

    melody.forEach((note, i) => {
      synthRef.current!.triggerAttackRelease(note, "8n", now + i * 0.5);
    });
  };

  // Summon warm vocal synthesis
  const summonVoice = async () => {
    if (!synthRef.current) return;

    const vocalMelody = ["G4", "A4", "B4", "C5", "B4", "A4"];
    const now = Tone.now();

    vocalMelody.forEach((note, i) => {
      synthRef.current!.triggerAttackRelease(
        note,
        "16n",
        now + i * 0.3,
        0.8
      );
    });
  };

  // Harmonize elements
  const harmonizeElements = () => {
    console.log("Elements find perfect resonance...");
  };

  // Paint vision on canvas
  const paintVision = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw organic particles
    ctx.fillStyle = "rgba(0, 217, 255, 0.6)";
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw flowing lines
    ctx.strokeStyle = "rgba(255, 0, 110, 0.4)";
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, Math.random() * canvas.height);
      ctx.lineTo(canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden flex">
      {/* SIDEBAR */}
      <div
        className={`fixed left-0 top-0 h-screen w-96 bg-gradient-to-b from-background via-background/95 to-background backdrop-blur-xl border-r border-cyan-500/20 transition-transform duration-600 z-50 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-cyan-500/20">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-pink-600 bg-clip-text text-transparent">
                Pure Sound
              </h2>
              <p className="text-xs text-foreground/50 mt-1">Sacred Lyrics</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lyrics Input */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <span>✍️</span> Sacred Lyrics
            </h3>
            <textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Words carry the soul of music..."
              className="w-full h-64 p-4 rounded-lg bg-white/5 border border-cyan-500/20 text-foreground placeholder-foreground/40 focus:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none transition backdrop-blur-sm"
            />
          </div>

          {/* Cultural Gateways */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">
              🌐 Cultural Gateways
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "Spotify", icon: "🎵" },
                { name: "Apple Music", icon: "🍎" },
                { name: "TikTok", icon: "📱" },
                { name: "Instagram", icon: "📸" },
              ].map((gateway) => (
                <button
                  key={gateway.name}
                  className="p-3 rounded-lg bg-white/5 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition text-sm font-medium"
                >
                  <span className="text-lg">{gateway.icon}</span>
                  <div className="text-xs mt-1">{gateway.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sound Spirits */}
          <div>
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">
              🤖 Sound Spirits
            </h3>
            <div className="space-y-2">
              {["Melody Spirit", "Vocal Spirit", "Vision Spirit"].map((spirit) => (
                <button
                  key={spirit}
                  className="w-full p-3 rounded-lg bg-white/5 border border-cyan-500/20 hover:border-pink-600/50 hover:bg-pink-600/10 transition text-sm font-medium text-left"
                >
                  {spirit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-600 ${sidebarOpen ? "ml-96" : "ml-0"}`}>
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-cyan-500/20 flex items-center px-8 z-40">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-white/10 rounded-lg transition mr-6"
          >
            <Music className="w-6 h-6 text-cyan-400" />
          </button>
          <h1 className="text-2xl font-bold">Dieter Studio</h1>
          <div className="ml-auto text-sm text-foreground/70">
            Flow:{" "}
            <span className="text-cyan-400 font-semibold">
              {isCreating ? flowStages[currentFlow] : "Ready"}
            </span>
          </div>
        </div>

        {/* Workspace */}
        <div className="pt-20 pb-32 px-8 flex flex-col items-center justify-center min-h-screen">
          {/* Flow Visualization */}
          <div className="mb-12 flex gap-4 flex-wrap justify-center">
            {flowStages.map((stage, i) => (
              <div
                key={stage}
                className={`px-6 py-3 rounded-full border transition-all duration-500 ${
                  i === currentFlow
                    ? "bg-cyan-500/20 border-cyan-500/60 shadow-lg shadow-cyan-500/30"
                    : i < currentFlow
                      ? "bg-pink-600/20 border-pink-600/60"
                      : "bg-white/5 border-cyan-500/20"
                }`}
              >
                <span className="font-medium">{stage}</span>
              </div>
            ))}
          </div>

          {/* Canvas for Vision */}
          <canvas
            ref={canvasRef}
            width={1000}
            height={560}
            className="w-full max-w-4xl h-auto rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-cyan-500/5 to-pink-600/5 mb-12 shadow-2xl shadow-cyan-500/10"
          />

          {/* Downloads Section */}
          {showDownloads && (
            <div className="w-full max-w-4xl animate-fade-in">
              <h3 className="text-center text-2xl font-bold mb-8 text-cyan-400">
                ✨ Masterpieces Born
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: "🎵", title: "Song", format: "WAV • 3:47" },
                  { icon: "🎥", title: "Video", format: "4K • 3:47" },
                  { icon: "🌿", title: "Stems", format: "8 Tracks" },
                ].map((item) => (
                  <button
                    key={item.title}
                    className="p-8 rounded-xl bg-gradient-to-br from-cyan-500/10 to-pink-600/10 border border-cyan-500/30 hover:border-cyan-500/60 hover:shadow-lg hover:shadow-cyan-500/20 transition group"
                  >
                    <div className="text-5xl mb-3 group-hover:scale-110 transition">
                      {item.icon}
                    </div>
                    <h4 className="font-semibold mb-1">{item.title}</h4>
                    <p className="text-xs text-foreground/60">{item.format}</p>
                    <div className="mt-4 flex items-center justify-center gap-2 text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition">
                      <Download className="w-4 h-4" />
                      Download
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FAB Button */}
        <button
          onClick={birthMasterpiece}
          disabled={isCreating}
          className={`fixed bottom-12 right-12 w-20 h-20 rounded-full flex items-center justify-center text-2xl transition-all duration-500 shadow-2xl ${
            isCreating
              ? "bg-pink-600/30 border-pink-600/60 animate-spin"
              : "bg-cyan-600/30 border-cyan-500/60 hover:bg-cyan-600/50 hover:shadow-cyan-500/50 hover:scale-110"
          } border-2 backdrop-blur-sm`}
          title="Birth Masterpiece"
        >
          {isCreating ? "🌟" : "✨"}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
