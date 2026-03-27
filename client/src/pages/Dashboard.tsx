import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Music, ShoppingCart, TrendingUp, Wallet, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("studio");

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    setLocation("/");
    return null;
  }

  // Fetch marketplace data
  const { data: userTracks, isLoading: tracksLoading } = trpc.marketplace.getUserTracks.useQuery();
  const { data: marketplaceTracks } = trpc.marketplace.getTracks.useQuery({ limit: 20, offset: 0 });
  const { data: wallet } = trpc.marketplace.getWallet.useQuery();
  const { data: salesHistory } = trpc.marketplace.getSalesHistory.useQuery();

  const walletBalance = wallet?.walletBalance || "0.00";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-cyan-500/30 bg-glass-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-cyan-500" />
            <h1 className="text-2xl font-bold">Dieter Studio</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 rounded-full border border-cyan-500/30">
              <span className="text-sm font-semibold">💰 ${walletBalance}</span>
            </div>
            <div className="text-sm">
              <p className="text-foreground/70">Welcome</p>
              <p className="font-semibold">{user?.name || "Creator"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-glass-card border border-cyan-500/30">
            <TabsTrigger value="studio" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">AI Studio</span>
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="mytracks" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">My Tracks</span>
            </TabsTrigger>
            <TabsTrigger value="promo" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Promo</span>
            </TabsTrigger>
          </TabsList>

          {/* AI STUDIO TAB */}
          <TabsContent value="studio" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="glass-card border-cyan-500/30 bg-glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-cyan-500" />
                      ✨ AI Music Generator
                    </CardTitle>
                    <CardDescription>
                      Describe your music and let AI create it
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <textarea
                      placeholder="upbeat EDM with female vocals, 128 BPM, 3:30 length..."
                      className="w-full h-40 p-4 rounded-lg bg-background/50 border border-cyan-500/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-cyan-500 resize-none"
                    />
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500"
                        onClick={() => alert("🎵 Generating Track...")}
                      >
                        🎵 Generate Track
                      </Button>
                      <Button 
                        variant="outline"
                        className="flex-1 border-cyan-500/50 hover:bg-cyan-500/10"
                        onClick={() => alert("🌿 Generating Stems...")}
                      >
                        🌿 Generate Stems
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="glass-card border-cyan-500/30 bg-glass">
                  <CardHeader>
                    <CardTitle className="text-lg">Engine Controls</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Voice</label>
                      <select className="w-full mt-2 p-2 rounded-lg bg-background/50 border border-cyan-500/30 text-foreground focus:outline-none focus:border-cyan-500">
                        <option>Male Deep (110Hz)</option>
                        <option>Female Bright (220Hz)</option>
                        <option>AI Choir</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">BPM</label>
                      <div className="flex gap-2 mt-2">
                        <input 
                          type="range" 
                          min="60" 
                          max="180" 
                          defaultValue="128"
                          className="flex-1"
                        />
                        <span className="text-sm font-semibold min-w-fit">128 BPM</span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-cyan-500/50 hover:bg-cyan-500/10"
                      onClick={() => alert("📁 Upload Reference")}
                    >
                      📁 Upload Reference
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* MARKETPLACE TAB */}
          <TabsContent value="marketplace" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceTracks && marketplaceTracks.length > 0 ? (
                marketplaceTracks.map((track) => (
                  <Card key={track.id} className="glass-card border-cyan-500/30 bg-glass hover:border-cyan-500/60 transition-all">
                    <CardHeader>
                      <CardTitle className="text-base">{track.title}</CardTitle>
                      <CardDescription>{track.genre || "Electronic"}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <audio 
                        controls 
                        src={track.audioUrl || "#"}
                        className="w-full h-8 rounded"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-cyan-500">
                          ${track.price || "2.99"}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500">
                            Buy
                          </Button>
                          <Button size="sm" variant="outline" className="border-cyan-500/50">
                            Rent $0.99
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-foreground/50">No tracks available yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* MY TRACKS TAB */}
          <TabsContent value="mytracks" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">My Tracks</h2>
              <Button 
                className="bg-cyan-600 hover:bg-cyan-500"
                onClick={() => setActiveTab("studio")}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </div>

            {tracksLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : userTracks && userTracks.length > 0 ? (
              <div className="space-y-4">
                {userTracks.map((track) => (
                  <Card key={track.id} className="glass-card border-cyan-500/30 bg-glass">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{track.title}</h3>
                          <p className="text-sm text-foreground/70">
                            {track.duration}s • {track.bpm} BPM
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-cyan-500/50"
                            onClick={() => alert("▶️ Playing: " + track.title)}
                          >
                            ▶️ Play
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-cyan-600 hover:bg-cyan-500"
                            onClick={() => alert("📤 List for sale")}
                          >
                            📤 Sell
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="border-cyan-500/50"
                            onClick={() => alert("📈 Promo")}
                          >
                            📈 Promo
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Music className="w-12 h-12 mx-auto text-foreground/30 mb-4" />
                <p className="text-foreground/50">No tracks yet. Create your first one!</p>
              </div>
            )}
          </TabsContent>

          {/* PROMO TAB */}
          <TabsContent value="promo" className="space-y-6">
            <Card className="glass-card border-cyan-500/30 bg-glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-500" />
                  📈 Analytics & Promo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-background/50 border border-cyan-500/30">
                    <CardContent className="pt-6">
                      <p className="text-sm text-foreground/70">Sales</p>
                      <p className="text-2xl font-bold text-cyan-500">
                        ${salesHistory?.reduce((sum, s) => sum + parseFloat(s.amount.toString()), 0).toFixed(2) || "0.00"}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 border border-cyan-500/30">
                    <CardContent className="pt-6">
                      <p className="text-sm text-foreground/70">Streams</p>
                      <p className="text-2xl font-bold text-magenta-500">14.7k</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-background/50 border border-cyan-500/30">
                    <CardContent className="pt-6">
                      <p className="text-sm text-foreground/70">Fans</p>
                      <p className="text-2xl font-bold text-amber-500">2.3k</p>
                    </CardContent>
                  </Card>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-cyan-600 to-magenta-600 hover:from-cyan-500 hover:to-magenta-500"
                  onClick={() => alert("🚀 Starting Auto-Promo Campaign...")}
                >
                  🚀 Auto-Promo Campaign
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
