/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { FavoritePair, TabType } from './types';
import { DEFAULT_FAVORITES } from './data/mockData';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import TimelineView from './components/TimelineView';
import TimetableView from './components/TimetableView';
import BottomNav from './components/BottomNav';
import { Bus, HelpCircle, Bell } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [favorites, setFavorites] = useState<FavoritePair[]>([]);
  const [selectedTimelineRouteId, setSelectedTimelineRouteId] = useState<string>('R30');
  const [mounted, setMounted] = useState<boolean>(false);

  // Read favorites from localStorage after mounting to avoid hydration/SSG mismatch
  useEffect(() => {
    const saved = localStorage.getItem('shinki_pwa_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        setFavorites(DEFAULT_FAVORITES);
      }
    } else {
      setFavorites(DEFAULT_FAVORITES);
    }
    setMounted(true);
  }, []);

  // Sync favorites back to localStorage
  const saveFavorites = (newFavs: FavoritePair[]) => {
    setFavorites(newFavs);
    localStorage.setItem('shinki_pwa_favorites', JSON.stringify(newFavs));
  };

  const handleAddFavorite = (fromId: string, toId: string) => {
    const newFav: FavoritePair = {
      id: `F-${Date.now()}`,
      fromStopId: fromId,
      toStopId: toId
    };
    saveFavorites([...favorites, newFav]);
  };

  const handleRemoveFavorite = (favId: string) => {
    const filtered = favorites.filter((f) => f.id !== favId);
    saveFavorites(filtered);
  };

  // Callback when a bus stop is tapped in the SearchView
  const handleSelectStopFromSearch = (stopId: string) => {
    // Determine the route of this stop and route thither
    if (stopId === 'H06') {
      setSelectedTimelineRouteId('R08'); // 8系統
    } else if (stopId === 'H08') {
      setSelectedTimelineRouteId('R40'); // 40系統
    } else {
      setSelectedTimelineRouteId('R30'); // 30系統 (all others pass here)
    }
    setActiveTab('timeline');
  };

  const handleNavigateToTimelineWithRoute = (routeId: string) => {
    setSelectedTimelineRouteId(routeId);
    setActiveTab('timeline');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans text-orange-950 p-5">
        <div className="text-center space-y-3">
          <Bus className="w-12 h-12 text-orange-600 animate-bounce mx-auto" />
          <p className="font-extrabold text-sm tracking-wider">神姫スマートナビ 起動中...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="pwa-application-root" className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900 selection:bg-orange-100 selection:text-orange-900 pb-20">
      
      {/* Universal branding bar, designed to mimic a compact native smartphone header */}
      <div className="bg-white border-b border-gray-150 px-4 py-3 sticky top-0 z-40 shadow-xs max-w-lg mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-650 flex items-center justify-center text-white font-black text-sm tracking-tight shadow-sm shadow-orange-600/30">
            神
          </div>
          <div>
            <span className="text-[9px] font-bold text-orange-650 tracking-widest block leading-none">SHINKI BUS PWA</span>
            <span className="text-xs font-black text-gray-900 leading-none">スマートナビ 姫路</span>
          </div>
        </div>

        {/* Global info controls */}
        <div className="flex items-center gap-2.5">
          <div className="bg-orange-50 text-orange-650 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-505 bg-emerald-500 animate-ping inline-block" />
            <span>システム正常</span>
          </div>
          <Bell className="w-4.5 h-4.5 text-gray-400 hover:text-orange-650 cursor-pointer" />
        </div>
      </div>

      {/* Main viewport area, supporting scrolling and fits exactly as a premium mobile app container */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto max-w-lg mx-auto w-full bg-white/40 shadow-xs">
        {activeTab === 'home' && (
          <HomeView
            favorites={favorites}
            onAddFavorite={handleAddFavorite}
            onRemoveFavorite={handleRemoveFavorite}
            onNavigateTab={setActiveTab}
            onNavigateToTimelineWithRoute={handleNavigateToTimelineWithRoute}
          />
        )}
        {activeTab === 'search' && (
          <SearchView
            onSelectStop={handleSelectStopFromSearch}
          />
        )}
        {activeTab === 'timeline' && (
          <TimelineView />
        )}
        {activeTab === 'timetable' && (
          <TimetableView />
        )}
      </main>

      {/* Persistent Bottom Handheld menu */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
