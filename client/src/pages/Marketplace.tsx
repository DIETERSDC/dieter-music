import React, { useState } from 'react';
import { Play, ShoppingCart, Heart, Share2, Download, Music, TrendingUp, Filter } from 'lucide-react';
import PlaybackModal from './PlaybackModal';

interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  lyrics: string;
  price: number;
  genre: string;
  mood: string;
  bpm: number;
  duration: string;
  plays: number;
  likes: number;
  createdAt: string;
}

// Demo songs - replace with API data
const DEMO_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'AI Studio',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
    audioUrl: '/api/songs/neon-dreams.mp3',
    lyrics: '[Verse]\nIn the city lights we come alive\nNeon dreams keep us flying high\n[Chorus]\nWe are electric, we are free\nDancing through eternity',
    price: 2.99,
    genre: 'Electronic',
    mood: 'Energetic',
    bpm: 128,
    duration: '3:24',
    plays: 12543,
    likes: 892,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Midnight Echoes',
    artist: 'Vocal Synth',
    coverUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
    audioUrl: '/api/songs/midnight-echoes.mp3',
    lyrics: '[Verse]\nSilent whispers in the night\nEchoes dancing in moonlight\n[Chorus]\nLost in rhythm, found in sound',
    price: 1.99,
    genre: 'Ambient',
    mood: 'Calm',
    bpm: 90,
    duration: '4:12',
    plays: 8721,
    likes: 654,
    createdAt: '2024-01-14',
  },
];

const Marketplace: React.FC = () => {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [showPlayback, setShowPlayback] = useState(false);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('trending');

  const handlePlay = (song: Song) => {
    setSelectedSong(song);
    setShowPlayback(true);
  };

  const handleBuy = (song: Song) => {
    // Implement purchase logic
    alert(`Purchase ${song.title} for $${song.price}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Song Marketplace
              </h1>
              <p className="text-sm text-gray-400 mt-1">Discover AI-Generated Music</p>
            </div>
            
            {/* Sort & Filter */}
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
              
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="text-2xl font-bold">247</p>
                <p className="text-sm text-gray-400">Total Songs</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <div>
                <p className="text-2xl font-bold">12.5K</p>
                <p className="text-sm text-gray-400">Total Plays</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-pink-400" />
              <div>
                <p className="text-2xl font-bold">1.8K</p>
                <p className="text-sm text-gray-400">Total Likes</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold">$4.2K</p>
                <p className="text-sm text-gray-400">Revenue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Song Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DEMO_SONGS.map((song) => (
            <div
              key={song.id}
              className="group relative rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handlePlay(song)}
                    className="p-4 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-110 transition-transform duration-200 shadow-lg shadow-cyan-500/50"
                  >
                    <Play className="w-8 h-8 text-white" />
                  </button>
                </div>
                
                {/* Price Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-white/20">
                  <span className="text-sm font-bold text-cyan-400">${song.price}</span>
                </div>
              </div>

              {/* Song Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1 truncate">{song.title}</h3>
                <p className="text-sm text-gray-400 mb-3 truncate">{song.artist}</p>
                
                {/* Tags */}
                <div className="flex gap-2 mb-3 text-xs">
                  <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {song.genre}
                  </span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {song.bpm} BPM
                  </span>
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{song.plays.toLocaleString()} plays</span>
                  <span>{song.likes} likes</span>
                  <span>{song.duration}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBuy(song)}
                    className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/30"
                  >
                    <ShoppingCart className="w-4 h-4 inline mr-2" />
                    Buy
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-12">
          <button className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all">
            Load More Songs
          </button>
        </div>
      </main>

      {/* Playback Modal */}
      {selectedSong && (
        <PlaybackModal
          isOpen={showPlayback}
          onClose={() => setShowPlayback(false)}
          songTitle={selectedSong.title}
          lyrics={selectedSong.lyrics}
          audioUrl={selectedSong.audioUrl}
        />
      )}
    </div>
  );
};

export default Marketplace;
