import React, { useState } from 'react';
import { Play, Edit, Trash2, Download, Share2, MoreVertical, Upload, Plus } from 'lucide-react';
import PlaybackModal from './PlaybackModal';
import { Link } from 'wouter';

interface MySong {
  id: string;
  title: string;
  coverUrl: string;
  audioUrl: string;
  lyrics: string;
  genre: string;
  bpm: number;
  duration: string;
  createdAt: string;
  plays: number;
  published: boolean;
}

const MY_SONGS: MySong[] = [
  {
    id: '1',
    title: 'My First Creation',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    audioUrl: '/api/my-songs/first.mp3',
    lyrics: '[Verse]\nThis is my story, written in sound\nEvery note a piece of me\n[Chorus]\nI create, I sing, I am alive',
    genre: 'Pop',
    bpm: 120,
    duration: '3:15',
    createdAt: '2024-01-20',
    plays: 156,
    published: true,
  },
];

const MySongs: React.FC = () => {
  const [songs, setSongs] = useState<MySong[]>(MY_SONGS);
  const [selectedSong, setSelectedSong] = useState<MySong | null>(null);
  const [showPlayback, setShowPlayback] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const handlePlay = (song: MySong) => {
    setSelectedSong(song);
    setShowPlayback(true);
  };

  const handleDelete = (songId: string) => {
    if (confirm('Are you sure you want to delete this song?')) {
      setSongs(songs.filter(s => s.id !== songId));
    }
  };

  const handlePublishToggle = (songId: string) => {
    setSongs(songs.map(s => 
      s.id === songId ? { ...s, published: !s.published } : s
    ));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                My Songs
              </h1>
              <p className="text-sm text-gray-400 mt-1">{songs.length} songs in your library</p>
            </div>
            
            <Link href="/#/studio">
              <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/30">
                <Plus className="w-5 h-5 inline mr-2" />
                Create New Song
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setView('grid')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'grid'
                  ? 'bg-white/10 border border-cyan-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-lg transition-all ${
                view === 'list'
                  ? 'bg-white/10 border border-cyan-500/30'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              List
            </button>
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="group relative rounded-xl bg-white/5 border border-white/10 overflow-hidden hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
              {/* Cover */}
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
                
                {/* Status Badge */}
                <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm border border-white/20">
                  <span className={`text-xs font-semibold ${
                    song.published ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {song.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>

              {/* Song Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold mb-1 truncate">{song.title}</h3>
                <div className="flex gap-2 mb-3 text-xs">
                  <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {song.genre}
                  </span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    {song.bpm} BPM
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                  <span>{song.plays} plays</span>
                  <span>{song.duration}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-4 gap-2">
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(song.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 transition-all flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
                
                {/* Publish Toggle */}
                <button
                  onClick={() => handlePublishToggle(song.id)}
                  className={`w-full mt-3 px-4 py-2 rounded-lg font-semibold transition-all ${
                    song.published
                      ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {song.published ? 'Published' : 'Publish to Marketplace'}
                </button>
              </div>
            </div>
          ))}
          
          {/* Create New Card */}
          <Link href="/#/studio">
            <div className="group relative rounded-xl bg-white/5 border-2 border-dashed border-white/20 hover:border-cyan-500/50 overflow-hidden transition-all duration-300 aspect-square cursor-pointer">
              <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
                <div className="p-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 group-hover:scale-110 transition-transform duration-200">
                  <Plus className="w-12 h-12 text-cyan-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Create New Song</h3>
                  <p className="text-sm text-gray-400">Start your musical journey</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Empty State */}
        {songs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="p-8 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 mb-6">
              <Upload className="w-16 h-16 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No songs yet</h2>
            <p className="text-gray-400 mb-6">Create your first AI-generated song</p>
            <Link href="/#/studio">
              <button className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-semibold transition-all duration-200">
                <Plus className="w-5 h-5 inline mr-2" />
                Start Creating
              </button>
            </Link>
          </div>
        )}
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

export default MySongs;
