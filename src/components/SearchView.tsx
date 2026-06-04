/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MapPin, Navigation, Map, AlertCircle, Compass, ChevronRight, Bus } from 'lucide-react';
import { MOCK_BUS_STOPS } from '../data/mockData';
import { BusStop } from '../types';

// Haversine formula calculation for exact walking距離 in meters
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

interface SearchViewProps {
  onSelectStop: (stopId: string) => void;
}

export default function SearchView({ onSelectStop }: SearchViewProps) {
  // Shinki bus-stop center in Himeji
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>({
    lat: 34.8290, // Default to Shirogane-cho mock center (near Himeji castle gateway)
    lng: 134.6902
  });
  
  const [isUsingGPS, setIsUsingGPS] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Auto-request GPS on mount (gracefully handles failure/iframe sandbox)
  useEffect(() => {
    requestGPSLocation();
  }, []);

  const requestGPSLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('このブラウザはGPS（現在地取得）に対応していません。');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsUsingGPS(true);
        setGpsError(null);
      },
      (error) => {
        console.warn('GPS error:', error);
        // Do not crash, keep beautiful user experience
        setGpsError('GPS情報の取得が制限されているか、電波が届きません。姫路駅周辺のお試し座標で探索をシミュレートしています。');
        setIsUsingGPS(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // Simulate moving user to alternate spots (e.g. closer to university or mountain)
  const handleSimulatePosition = (location: 'center' | 'campus' | 'mountain') => {
    if (location === 'center') {
      setUserCoords({ lat: 34.8295, lng: 134.6900 }); // Near Shirogane
    } else if (location === 'campus') {
      setUserCoords({ lat: 34.8570, lng: 134.6670 }); // Near Prefectural Univ
    } else {
      setUserCoords({ lat: 34.8760, lng: 134.6590 }); // Near Shosha Ropeway
    }
    setIsUsingGPS(false);
    setGpsError(null);
  };

  // Calculate distances and sort stops
  const calculatedBusStops = MOCK_BUS_STOPS.map((stop) => {
    const distanceMeters = userCoords 
      ? calculateDistance(userCoords.lat, userCoords.lng, stop.lat, stop.lng)
      : 999999;
    
    return {
      ...stop,
      distance: Math.round(distanceMeters)
    };
  })
  .filter(stop => {
    // Search filter
    if (!searchTerm) return true;
    return (
      stop.name.includes(searchTerm) || 
      stop.kana.includes(searchTerm) ||
      stop.lines.some(l => l.includes(searchTerm))
    );
  })
  .sort((a, b) => a.distance - b.distance);

  return (
    <div id="gps-search-panel" className="pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Red-orange premium GPS header */}
      <header className="mb-5 bg-shinki text-white p-6 shadow-lg rounded-3xl flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-shinki font-black px-2.5 py-0.5 rounded text-xs tracking-wider">
              定位探知
            </span>
            <span className="text-[10px] tracking-widest text-orange-200">GPS DIRECT</span>
          </div>
          <h1 className="text-2xl font-black mt-1.5 tracking-tight font-sans">
            周辺バス停・即時探知
          </h1>
          <p className="text-white/90 text-xs mt-2 rounded bg-black/15 p-2.5 border border-white/10 leading-relaxed font-sans">
            GPS位置情報を取得し、一番近い順に並び替えます。知らない土地や迷いやすい姫路周辺でもバス停を見守り探知します。
          </p>
        </div>
        <Compass className="w-10 h-10 opacity-90 animate-spin-slow text-orange-100 shrink-0 ml-4 hidden sm:block" />
      </header>

      {/* Search Input bar */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-150 mb-4">
        <input
          id="bus-stop-search-box"
          type="text"
          placeholder="バス停名、ひらがな、〇〇系統で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm py-3 px-4 border border-gray-200 rounded-xl focus:outline-hidden focus:border-shinki focus:ring-2 focus:ring-orange-100 text-gray-800 font-sans tracking-wide"
        />
      </div>

      {/* GPS Status Indicator & Calibration Options */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 border-t-8 border-slate-800 mb-5">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">現在地ステータス</span>
          <button
            onClick={requestGPSLocation}
            className="text-xs font-extrabold text-shinki hover:text-shinki-dark bg-orange-50 px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>GPS再取得</span>
          </button>
        </div>

        {gpsError ? (
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200 text-amber-950 text-xs flex gap-2 mb-3">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{gpsError}</p>
          </div>
        ) : (
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-150 text-emerald-955 text-xs flex gap-2 mb-3">
            <MapPin className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">高精度GPS測位完了</p>
              <p className="opacity-80">
                緯度: {userCoords?.lat.toFixed(5)} / 経度: {userCoords?.lng.toFixed(5)} ({isUsingGPS ? '実位置' : 'シミュレーション位置'})
              </p>
            </div>
          </div>
        )}

        {/* Mock/Demo Location Switcher for full testing coverage */}
        <div>
          <span className="block text-[11px] font-bold text-gray-400 mb-2">
            【デモ体験】現在地を変えてテストする：
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleSimulatePosition('center')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold border transition-all text-center ${
                !isUsingGPS && userCoords?.lat === 34.8295
                  ? 'bg-shinki text-white border-shinki font-extrabold shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-150 border-gray-200'
              }`}
            >
              姫路駅前 徒歩5分
            </button>
            <button
              onClick={() => handleSimulatePosition('campus')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold border transition-all text-center ${
                userCoords?.lat === 34.8570
                  ? 'bg-shinki text-white border-shinki font-extrabold shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-150 border-gray-200'
              }`}
            >
              県立大キャンパス前
            </button>
            <button
              onClick={() => handleSimulatePosition('mountain')}
              className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-bold border transition-all text-center ${
                userCoords?.lat === 34.8760
                  ? 'bg-shinki text-white border-shinki font-extrabold shadow-sm'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-150 border-gray-200'
              }`}
            >
              書写ロープウェイ山麓
            </button>
          </div>
        </div>
      </div>

      {/* Bus Stop Sorted List */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 border-t-8 border-shinki">
        <h3 className="text-lg font-black text-slate-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
          <span>付近の停留所一覧</span>
          <span className="text-xs bg-orange-100 text-shinki-dark font-black px-2.5 py-1 rounded-full font-sans">
            近い順
          </span>
        </h3>

        {calculatedBusStops.length === 0 ? (
          <div className="text-center py-10 text-gray-400 font-sans">
            合致するバス停が見つかりませんでした。
          </div>
        ) : (
          <div className="space-y-3.5">
            {calculatedBusStops.map((stop) => {
              // Convert distance to km if long
              const displayDistance = 
                stop.distance > 1000 
                  ? `${(stop.distance / 1000).toFixed(1)} km` 
                  : `${stop.distance} m`;

              // Estimated walking speed: 80m per minute
              const walkingTime = Math.ceil(stop.distance / 80);

              return (
                <div
                  key={stop.id}
                  onClick={() => onSelectStop(stop.id)}
                  id={`search-stop-item-${stop.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-orange-50/50 border border-gray-150 bg-white cursor-pointer active:scale-98 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    {/* Small map pin background ring */}
                    <div className="w-12 h-12 bg-orange-50 group-hover:bg-orange-100 rounded-2xl flex items-center justify-center shrink-0 border border-orange-100/50 transition-colors">
                      <Bus className="w-6 h-6 text-shinki" />
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-shinki-dark">
                        {stop.kana}
                      </p>
                      <h4 className="text-md font-extrabold text-slate-900 tracking-tight">
                        {stop.name}
                      </h4>
                      {/* Lines badges */}
                      <div className="flex gap-1 flex-wrap mt-1">
                        {stop.lines.map((line) => (
                          <span 
                            key={line} 
                            className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md text-white ${
                              line === '30系統' ? 'bg-orange-500' :
                              line === '8系統' ? 'bg-indigo-500' : 'bg-emerald-500'
                            }`}
                          >
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Distance and ETA */}
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <span className="block text-sm font-black text-gray-900 tracking-wider">
                        {displayDistance}
                      </span>
                      <span className="block text-[10px] text-gray-400">
                        徒歩約 {walkingTime} 分
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-shinki group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 bg-gray-100 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed font-sans">
        <p className="font-bold mb-1">📢 神姫バス乗り入れ豆知識</p>
        <p>姫路駅前は北口バスターミナルをメインに、発着番号が複雑に別れています。当アプリで目的地までの距離を測定してあらかじめ出発しておくことで、余裕をもって正しいのり場にお越しいただけます。</p>
      </div>
    </div>
  );
}
