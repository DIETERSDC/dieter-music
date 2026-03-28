import { Button } from "@/components/ui/button";
import { Check, X, Zap, Music, Headphones, TrendingUp } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const plans = [
    {
      name: "Creator",
      price: "$9",
      period: "/month",
      description: "Perfect for getting started",
      icon: Music,
      color: "from-blue-500 to-cyan-500",
      features: [
        { text: "10 songs/month", included: true },
        { text: "51 voices", included: true },
        { text: "Basic effects", included: true },
        { text: "WAV export", included: true },
        { text: "Marketplace access", included: false },
        { text: "Stem export", included: false },
        { text: "Priority support", included: false },
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Producer",
      price: "$29",
      period: "/month",
      description: "For serious creators",
      icon: Headphones,
      color: "from-purple-500 to-pink-500",
      features: [
        { text: "Unlimited songs", included: true },
        { text: "51 voices + RVC v2", included: true },
        { text: "Professional effects", included: true },
        { text: "WAV, MP3, FLAC export", included: true },
        { text: "Marketplace access", included: true },
        { text: "Stem export", included: true },
        { text: "Email support", included: true },
      ],
      cta: "Get Started",
      highlighted: true,
    },
    {
      name: "Label",
      price: "$99",
      period: "/month",
      description: "For music labels",
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
      features: [
        { text: "Unlimited everything", included: true },
        { text: "Custom voices", included: true },
        { text: "Advanced effects", included: true },
        { text: "All export formats", included: true },
        { text: "Marketplace + Analytics", included: true },
        { text: "Team collaboration", included: true },
        { text: "24/7 priority support", included: true },
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  const features = [
    {
      title: "AI Music Generation",
      description: "Generate complete songs from lyrics using ACE-Step 1.5",
      icon: Zap,
    },
    {
      title: "51 Voices",
      description: "Choose from 51 professional voices across multiple languages",
      icon: Headphones,
    },
    {
      title: "RVC v2 Voice Conversion",
      description: "Apply any voice to your generated music",
      icon: Music,
    },
    {
      title: "Professional DAW",
      description: "Multi-track mixer, effects rack, and waveform editing",
      icon: Music,
    },
    {
      title: "Stem Separation",
      description: "Separate vocals, drums, bass, and other instruments",
      icon: Music,
    },
    {
      title: "Marketplace",
      description: "Sell your music and earn royalties",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      {/* HEADER */}
      <div className="border-b border-cyan-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-6 h-6 text-cyan-500" />
            <h1 className="text-xl font-bold">Dieter</h1>
          </div>
          <a href="/" className="text-gray-400 hover:text-white transition">
            Back to Home
          </a>
        </div>
      </div>

      {/* HERO */}
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Choose the perfect plan for your music creation journey. All plans include
          our full-featured AI music generation engine.
        </p>
      </div>

      {/* PRICING CARDS */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border-2 transition ${
                  plan.highlighted
                    ? "border-cyan-500 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 transform md:scale-105"
                    : "border-cyan-500/30 bg-white/5 hover:border-cyan-500/50"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* ICON */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${plan.color} p-3 mb-6`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* PLAN NAME */}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                  {/* PRICE */}
                  <div className="mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>

                  {/* CTA BUTTON */}
                  <Button
                    className={`w-full mb-8 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
                        : "bg-cyan-600 hover:bg-cyan-500"
                    }`}
                    onClick={() => {
                      if (!isAuthenticated) {
                        window.location.href = getLoginUrl();
                      }
                    }}
                  >
                    {plan.cta}
                  </Button>

                  {/* FEATURES LIST */}
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-sm ${
                            feature.included ? "text-white" : "text-gray-600"
                          }`}
                        >
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need to Create
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-lg border border-cyan-500/30 bg-white/5 hover:border-cyan-500/50 transition"
              >
                <Icon className="w-8 h-8 text-cyan-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {[
            {
              q: "Can I cancel anytime?",
              a: "Yes! You can cancel your subscription at any time. No hidden fees or long-term contracts.",
            },
            {
              q: "Do you offer a free trial?",
              a: "Yes! Creator plan includes a 7-day free trial with full access to all features.",
            },
            {
              q: "Can I upgrade or downgrade?",
              a: "Absolutely. Change your plan anytime and we'll prorate your billing accordingly.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and cryptocurrency payments.",
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-6 rounded-lg border border-cyan-500/30 bg-white/5">
              <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Start Creating?</h2>
        <p className="text-xl text-gray-400 mb-8">
          Join thousands of creators using Dieter to make professional music
        </p>
        <Button
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-3 text-lg"
          onClick={() => {
            if (!isAuthenticated) {
              window.location.href = getLoginUrl();
            }
          }}
        >
          Get Started Now
        </Button>
      </div>

      {/* FOOTER */}
      <div className="border-t border-cyan-500/20 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2026 Dieter Music. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
