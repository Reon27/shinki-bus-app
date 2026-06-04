/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Home, MapPin, Route, Clock } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'home' as TabType, label: 'ホーム', icon: Home },
    { id: 'search' as TabType, label: '周辺検索', icon: MapPin },
    { id: 'timeline' as TabType, label: '路線図', icon: Route },
    { id: 'timetable' as TabType, label: '時刻表', icon: Clock },
  ];

  return (
    <nav 
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg px-2 pb-safe z-50 rounded-t-2xl max-w-lg mx-auto"
    >
      <div className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-tab-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center w-20 h-16 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-shinki font-bold scale-105 bg-orange-50' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              aria-label={item.label}
            >
              <Icon 
                className={`w-7 h-7 mb-1.5 transition-transform duration-300 ${
                  isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'
                }`} 
              />
              <span className="text-[11px] tracking-wider font-sans leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
