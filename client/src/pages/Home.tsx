import { Button } from "@/components/ui/button";
import { Music, Zap, Headphones, Download, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * DIETER MUSIC PLATFORM
 * Design Philosophy: Neo-Noir Analog Sanctuary
 * - Dark, intimate aesthetic with neon accents (cyan #00d9ff, magenta #ff006e)
 * - Glassmorphism panels creating depth and sanctuary feeling
 * - Analog warmth through amber glows and serif typography
 * - Organic animations that feel alive, never mechanical
 */

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass-card border-b border-cyan-500/30 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6 text-cyan-500" />
            <span className="text-xl font-bold tracking-wider">DIETER</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#sanctuary" className="text-sm hover:text-cyan-500 transition">
              Sanctuary
            </a>
            <a href="#workflow" className="text-sm hover:text-cyan-500 transition">
              Workflow
            </a>
            <a href="#features" className="text-sm hover:text-cyan-500 transition">
              Features
            </a>
            <Button
              className="bg-cyan-600 hover:bg-cyan-500 text-background"
              size="sm"
            >
              Enter Studio
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background with studio image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/studio-vocal.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.3,
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-background via-background/80 to-background" />

        <div className="container relative z-10 flex flex-col items-center justify-center text-center">
          <div className="fade-in-up space-y-6 max-w-3xl">
            <div className="inline-block px-4 py-2 glass-card border-cyan-500/30 mb-4">
              <span className="text-sm text-cyan-400 font-mono">
                THE SANCTUARY AWAITS
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              For those who hear
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-600">
                music in silence
              </span>
            </h1>

            <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Who feel rhythm in breath, who see color in chords. Dieter is your sanctuary.
              <span className="block mt-2 text-cyan-400 font-semibold">
                Pour your soul. We handle the alchemy.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-background font-semibold neon-glow-hover"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Creating
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink-600/50 hover:border-pink-500 hover:bg-pink-600/10"
              >
                Learn More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* Animated waveform */}
          <div className="mt-16 w-full max-w-2xl">
            <svg
              viewBox="0 0 1200 120"
              className="w-full h-auto opacity-50"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.5" />
                  <stop offset="50%" stopColor="#ff006e" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              <path
                d="M 0 60 Q 150 20 300 60 T 600 60 T 900 60 T 1200 60"
                stroke="url(#waveGradient)"
                strokeWidth="3"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section id="sanctuary" className="py-20 md:py-32 relative">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative h-96 md:h-full rounded-lg overflow-hidden glass-card border-cyan-500/20">
              <img
                src="/studio-mixing.webp"
                alt="Professional mixing studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Right: Manifesto */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  The Sacred Workflow
                </h2>
                <p className="text-foreground/70 text-lg leading-relaxed">
                  Your lyrics aren't typed—they're poured. Your melody isn't generated—it's invoked.
                  Every step honors your creative spirit while our alchemy transforms raw emotion
                  into polished masterpieces.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: Music, label: "Sacred Lyrics", desc: "Pour your soul into words" },
                  {
                    icon: Zap,
                    label: "Organic Melody",
                    desc: "Spirits invoke from your cadence",
                  },
                  {
                    icon: Headphones,
                    label: "Warm Vocals",
                    desc: "Real voices with breath and vibrato",
                  },
                  {
                    icon: Download,
                    label: "Masterpiece",
                    desc: "Download in studio quality",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 glass-card border-cyan-500/10 hover:border-cyan-500/30 transition-all"
                    style={{
                      animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both`,
                    }}
                  >
                    <div className="flex-shrink-0">
                      <item.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.label}</h4>
                      <p className="text-sm text-foreground/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 relative">
        {/* Decorative background */}
        <div
          className="absolute inset-0 z-0 opacity-5"
          style={{
            backgroundImage: "url('/studio-vocal.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The Alchemy Engine
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Powered by cutting-edge audio synthesis, cultural intelligence, and analog warmth
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Analog Soul",
                desc: "Tape saturation, vinyl crackle, and tube warmth recreate the golden era of recording",
                icon: "🎛️",
              },
              {
                title: "Cultural Scales",
                desc: "Detects pentatonic, hijaz, major, minor—respects musical traditions worldwide",
                icon: "🌍",
              },
              {
                title: "Real Voices",
                desc: "Formant synthesis creates singing voices with breath, vibrato, and emotional phrasing",
                icon: "🎤",
              },
              {
                title: "Humanized Timing",
                desc: "Organic ±20ms randomization ensures nothing sounds mechanical or sterile",
                icon: "⏱️",
              },
              {
                title: "Vision Engine",
                desc: "BPM-synced particle flows and organic animations that dance with your music",
                icon: "✨",
              },
              {
                title: "Mastering Ready",
                desc: "24-bit/48kHz zero-latency processing delivers studio-quality deliverables",
                icon: "🎧",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-card-hover p-6 border-cyan-500/10"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both`,
                }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 md:py-32">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Your Creative Journey
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Left: Studio Image */}
            <div className="relative h-96 md:h-full rounded-lg overflow-hidden glass-card border-pink-600/20">
              <img
                src="/studio-vocal.webp"
                alt="Vocal recording studio"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Right: Process Steps */}
            <div className="space-y-8 flex flex-col justify-center">
              {[
                {
                  step: "01",
                  title: "Write",
                  desc: "Express your deepest emotions through lyrics. Our ultra-responsive textarea feels like whispering to a collaborator.",
                },
                {
                  step: "02",
                  title: "Create",
                  desc: "Watch as AI spirits read your soul's meter and rhyme density to birth organic melodies that honor your intent.",
                },
                {
                  step: "03",
                  title: "Sing",
                  desc: "Real singing voices with pitch contour, formant synthesis, and organic vibrato bring your vision to life.",
                },
                {
                  step: "04",
                  title: "Master",
                  desc: "Professional mixing and mastering with analog modeling ensures your song sounds timeless and warm.",
                },
                {
                  step: "05",
                  title: "Share",
                  desc: "One-click distribution to Spotify, Apple Music, TikTok, and Instagram. Your music reaches the world.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-6 pb-8 border-b border-cyan-500/10 last:border-b-0"
                  style={{
                    animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-600 to-pink-600 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-foreground/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="py-20 md:py-32 relative">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Your Masterpiece Awaits
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                title: "Song",
                format: "WAV/MP3",
                quality: "24-bit/48kHz",
                icon: "🎵",
              },
              {
                title: "Vision",
                format: "MP4 Video",
                quality: "4K • BPM-synced",
                icon: "🎥",
              },
              {
                title: "Stems",
                format: "ZIP Archive",
                quality: "8 tracks • Mix-ready",
                icon: "🎼",
              },
              {
                title: "Metadata",
                format: "Complete",
                quality: "Ready for distribution",
                icon: "📋",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="glass-card-hover p-8 text-center border-cyan-500/10"
                style={{
                  animation: `fade-in-up 0.6s ease-out ${i * 0.1}s both`,
                }}
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/70 mb-1">{item.format}</p>
                <p className="text-xs text-cyan-400 font-mono">{item.quality}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-transparent to-pink-600/10" />
        </div>

        <div className="container relative z-10 text-center">
          <div className="max-w-2xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Create?
            </h2>
            <p className="text-lg text-foreground/70">
              Step into the sanctuary. Your next masterpiece is waiting to be born.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-background font-semibold neon-glow-hover"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Enter the Studio
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink-600/50 hover:border-pink-500 hover:bg-pink-600/10"
              >
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-cyan-500/10 py-12 md:py-16">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Music className="w-5 h-5 text-cyan-500" />
                DIETER
              </h4>
              <p className="text-sm text-foreground/60">
                The sanctuary for those who hear music in silence.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Studio
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Tutorials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-cyan-500 transition">
                    Discord
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cyan-500/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60">
            <p>&copy; 2026 Dieter Music. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-cyan-500 transition">
                Privacy
              </a>
              <a href="#" className="hover:text-cyan-500 transition">
                Terms
              </a>
              <a href="#" className="hover:text-cyan-500 transition">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
