/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Route, Info, AlertCircle, RefreshCw, Smartphone, AlertTriangle } from 'lucide-react';
import { MOCK_ROUTES, MOCK_BUS_STOPS, MOCK_ACTIVE_BUSES } from '../data/mockData';
import { ActiveBus } from '../types';

export default function TimelineView() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('R30'); // Default to ゆめさき台線
  const [activeBuses, setActiveBuses] = useState<ActiveBus[]>(MOCK_ACTIVE_BUSES);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Simulated live update loop for realtime progress
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBuses((prevBuses) =>
        prevBuses.map((bus) => {
          // Increment progress slightly for simulation
          let nextProgress = bus.progress + 0.04;
          let fromStop = bus.currentSegmentFrom;
          let toStop = bus.currentSegmentTo;

          // If reached destination segment, loop around to simulate continuous flow
          if (nextProgress >= 1.0) {
            nextProgress = 0.0;
            const currentRoute = MOCK_ROUTES.find((r) => r.id === bus.routeId);
            if (currentRoute) {
              const stops = currentRoute.stops;
              const toIndex = stops.indexOf(toStop);
              if (toIndex !== -1 && toIndex < stops.length - 1) {
                fromStop = toStop;
                toStop = stops[toIndex + 1];
              } else {
                // Loop back to start segment
                fromStop = stops[0];
                toStop = stops[1];
              }
            }
          }

          return {
            ...bus,
            progress: parseFloat(nextProgress.toFixed(3)),
            currentSegmentFrom: fromStop,
            currentSegmentTo: toStop,
          };
        })
      );
    }, 3000); // Update every 3 seconds for beautiful UI action

    return () => clearInterval(timer);
  }, []);

  const route = MOCK_ROUTES.find((r) => r.id === selectedRouteId);
  const stops = route ? route.stops : [];

  // Filter buses running on the current route
  const currentRouteBuses = activeBuses.filter((bus) => bus.routeId === selectedRouteId);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const getCrowdLabel = (crowded: string) => {
    switch (crowded) {
      case 'low':
        return { label: '空席多数', color: 'bg-emerald-100 text-emerald-800' };
      case 'medium':
        return { label: 'やや混雑', color: 'bg-amber-100 text-amber-800' };
      case 'high':
        return { label: '超混雑', color: 'bg-rose-100 text-rose-800 animate-pulse' };
      default:
        return { label: '普通', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div id="interactive-timeline-panel" className="pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Header with high contrast orange theme */}
      <header className="mb-5 bg-shinki text-white p-6 shadow-lg rounded-3xl flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-shinki font-black px-2.5 py-0.5 rounded text-xs tracking-wider">
              のりば案内
            </span>
            <span className="text-[10px] tracking-widest text-orange-200">REALTIME GPS</span>
          </div>
          <h1 className="text-2xl font-black mt-1.5 tracking-tight font-sans">
            路線バス リアルタイム追跡
          </h1>
          <p className="text-white/90 text-xs mt-2 rounded bg-black/15 p-2.5 border border-white/10 leading-relaxed font-sans">
            GPS発信機を搭載したバスの走行位置を3秒おきにリアルタイム更新（モック自動走行）。遅延状況も同期中。
          </p>
        </div>
        <Route className="w-10 h-10 opacity-90 text-orange-100 shrink-0 ml-4 hidden sm:block" />
      </header>

      {/* Selector and Refresher */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 bg-white rounded-xl px-4 py-3 shadow-xs border border-gray-150">
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">路線を選択</label>
          <select
            id="timeline-route-selector"
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="w-full text-sm font-black text-slate-800 bg-transparent py-0.5 border-none focus:outline-hidden focus:ring-0 cursor-pointer"
          >
            {MOCK_ROUTES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.systemNumber} - {r.name.replace('姫路駅前〜', '')}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleRefresh}
          className="bg-white hover:bg-orange-50 border border-gray-150 rounded-xl px-5 flex items-center justify-center shadow-xs text-gray-700 transition-colors"
          title="最新情報に手動更新"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-shinki' : ''}`} />
        </button>
      </div>

      {/* Main Roadmap Timeline Board */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 border-t-8 border-shinki relative overflow-hidden">
        
        {/* Realtime flashing beacon */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-shinki rounded-full animate-ping" />
            <span className="text-xs font-black text-shinki-dark tracking-wider font-sans">GPS自動追跡稼働中</span>
          </div>
          <span className="text-[11px] text-gray-400 font-sans">※3秒ごとにバスが走行を続けます</span>
        </div>

        {/* Timeline Path Line */}
        <div className="relative">
          {/* Vertical central support line */}
          <div className="absolute left-6 top-4 bottom-4 w-1.5 bg-gradient-to-b from-orange-400 to-shinki-light rounded-full z-0" />

          {/* List of stops */}
          <div className="space-y-12 relative z-10">
            {stops.map((stopId, index) => {
              const stop = MOCK_BUS_STOPS.find((s) => s.id === stopId);
              if (!stop) return null;

              // Check if there's any bus EXACTLY on this stop currently (e.g., progress is very tiny or segment boundary)
              const busesExactlyHere = currentRouteBuses.filter(
                (bus) => bus.currentSegmentTo === stopId && bus.progress > 0.95
              );

              return (
                <div key={stopId} className="relative">
                  <div className="flex items-center gap-4 pl-1.5">
                    {/* Ring Badge */}
                    <div className="w-10 h-10 rounded-full bg-white border-4 border-shinki shadow-sm flex items-center justify-center z-12 cursor-pointer hover:scale-105 transition-transform">
                      <span className="text-xs font-black text-slate-800 font-mono">
                        {index + 1}
                      </span>
                    </div>

                    {/* Stop Details */}
                    <div className="flex-1 bg-gray-50/50 hover:bg-gray-55 p-3 rounded-2xl border border-gray-150 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-shinki shadow-xs leading-none tracking-wider mb-1">
                            {stop.kana}
                          </p>
                          <h4 className="text-md font-extrabold text-slate-900 tracking-tight leading-tight">
                            {stop.name}
                          </h4>
                        </div>
                        {index === 0 && (
                          <span className="bg-shinki text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            始発停留所
                          </span>
                        )}
                        {index === stops.length - 1 && (
                          <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            終点
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active Bus Segment Interstitial Animation (Bus driving between stop [index] and [index+1]) */}
                  {index < stops.length - 1 && (() => {
                    const nextStopId = stops[index + 1];
                    // Find any bus currently moving between 'stopId' and 'nextStopId'
                    const segmentBus = currentRouteBuses.find(
                      (bus) => bus.currentSegmentFrom === stopId && bus.currentSegmentTo === nextStopId
                    );

                    if (!segmentBus) return null;

                    const crowd = getCrowdLabel(segmentBus.isCrowded);

                    return (
                      <div 
                        className="absolute left-4 w-full flex items-center z-20 pointer-events-none"
                        style={{
                          top: 'calc(100% + 4px)',
                          // Calculate position down based on bus progress
                          transform: 'translateY(-50%)',
                        }}
                      >
                        {/* Bus Dot with blinking ring */}
                        <div 
                          className="absolute bg-shinki text-white w-9 h-9 rounded-2xl shadow-xl border-2 border-white flex items-center justify-center transition-all duration-1000 ease-linear animate-pulse"
                          style={{
                            top: `${segmentBus.progress * 38}px`, // Scaled distance calculation
                            left: '1px'
                          }}
                        >
                          <span className="text-xs font-bold font-sans">🚌</span>
                        </div>

                        {/* Speed Bubble Info next to the moving bus */}
                        <div 
                          className="absolute bg-slate-900/98 text-white p-2.5 rounded-2xl shadow-lg border border-slate-800 ml-11 pointer-events-auto"
                          style={{
                            top: `${segmentBus.progress * 38 - 12}px`, // Aligns beautifully alongside the bus icon
                            maxWidth: '240px'
                          }}
                        >
                          {/* System Number Badge */}
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="bg-shinki px-1.5 py-0.5 rounded text-[9px] font-black tracking-wider">
                              {segmentBus.systemNumber}
                            </span>
                            <span className="text-[10px] font-bold text-gray-300">
                              {segmentBus.destination}
                            </span>
                          </div>

                          {/* Real-time Status details: countdown and delayed minute indicators */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {segmentBus.delayMinutes > 0 ? (
                              <span className="bg-rose-600 text-[10px] text-white px-1.5 py-0.5 rounded font-black flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                遅延 +{segmentBus.delayMinutes}分
                              </span>
                            ) : (
                              <span className="bg-emerald-600 text-[10px] text-white px-1.5 py-0.5 rounded font-black">
                                定時運行
                              </span>
                            )}

                            {/* Crowd capacity rating */}
                            <span className={`${crowd.color} text-[9px] px-1.5 py-0.5 rounded font-bold`}>
                              {crowd.label}
                            </span>
                          </div>

                          {/* Accurate simulated countdown based on segmented progress remaining */}
                          <p className="text-[10px] text-shinki-light font-bold mt-1 tracking-wider">
                            次のバス停まで残り約 {Math.max(15, Math.round((1 - segmentBus.progress) * 80))} 秒前後
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Safety info at screen base */}
      <div className="mt-4 bg-orange-50 rounded-2xl p-4 border border-orange-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-shinki mt-0.5 shrink-0" />
        <div className="text-xs text-orange-950 font-sans space-y-1">
          <p className="font-bold">💡 運行タイムラインの読み方 </p>
          <p>神姫バスの車載GPSビーコンの発信情報を基に、現在停留所間のどのあたりを進んでいるかをオレンジ色のアイコン（🚌）で秒単位カウント表示します。寒い日や雨の日でも、これでイライラすることなくピンポイント調整が可能です。</p>
        </div>
      </div>
    </div>
  );
}
