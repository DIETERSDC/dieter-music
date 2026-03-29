import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Music2, ShoppingBag, Library, Settings, Plus, Sparkles } from 'lucide-react';

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { path: '/studio', label: 'Create', icon: <Plus className="w-5 h-5" /> },
  { path: '/my-songs', label: 'My Songs', icon: <Library className="w-5 h-5" /> },
  { path: '/marketplace', label: 'Marketplace', icon: <ShoppingBag className="w-5 h-5" /> },
];

const Sidebar: React.FC = () => {
  const [location] = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500">
              <Music2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Dieter Music
              </h1>
              <p className="text-xs text-gray-400">AI Studio</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path || location === `/#${item.path}`;
          
          return (
            <Link key={item.path} href={`/#${item.path}`}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-white'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Create Button */}
      <div className="p-4 border-t border-white/10">
        <Link href="/#/studio">
          <button className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 font-semibold transition-all duration-200 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Create Song
          </button>
        </Link>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="text-xs text-gray-500 text-center">
          <p>Powered by ACE-Step 1.5</p>
          <p className="mt-1">AI Voice Synthesis</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
