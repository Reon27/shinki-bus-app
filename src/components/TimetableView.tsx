/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CreditCard, Info, MapPin } from 'lucide-react';
import { MOCK_TIMETABLE, MOCK_BUS_STOPS, MOCK_ROUTES } from '../data/mockData';
import { TimetableEntry } from '../types';

export default function TimetableView() {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('R30'); // Default to 30系統
  const [dayType, setDayType] = useState<'weekday' | 'saturday' | 'holiday'>('weekday');
  const [showICInfo, setShowICInfo] = useState<boolean>(false);

  // Auto-detect today's timetable type
  useEffect(() => {
    const today = new Date();
    const day = today.getDay(); // 0: Sunday, 6: Saturday, 1-5: Weekday
    
    // Simplistic holiday mock: detect Sundays as 'holiday', Saturday as 'saturday', others 'weekday'
    if (day === 0) {
      setDayType('holiday');
    } else if (day === 6) {
      setDayType('saturday');
    } else {
      setDayType('weekday');
    }
  }, []);

  const currentRoute = MOCK_ROUTES.find(r => r.id === selectedRouteId);
  const routeStopsInfo = currentRoute 
    ? currentRoute.stops.map(id => MOCK_BUS_STOPS.find(s => s.id === id)).filter(Boolean)
    : [];

  // Filter timetable for selected system number and day type
  const systemNoOnly = currentRoute?.systemNumber.replace('系統', '') || '';
  const filteredTimetable = MOCK_TIMETABLE.filter(
    item => item.systemNumber === systemNoOnly && item.dayType === dayType
  ).sort((a, b) => (a.hour * 60 + a.minute) - (b.hour * 60 + b.minute));

  // Destination stop is usually the last stop of the route list
  const destinationStopName = routeStopsInfo.length > 0 
    ? routeStopsInfo[routeStopsInfo.length - 1]?.name 
    : '';

  return (
    <div id="smart-timetable-panel" className="pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Header with warm theme */}
      <header className="mb-5 bg-shinki text-white p-6 shadow-lg rounded-3xl flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-shinki font-black px-2.5 py-0.5 rounded text-xs tracking-wider">
              ダイヤ案内
            </span>
            <span className="text-[10px] tracking-widest text-orange-200">TODAY ONLY</span>
          </div>
          <h1 className="text-2xl font-black mt-1.5 tracking-tight font-sans">
            今日特化型 スマート時刻表
          </h1>
          <p className="text-white/90 text-xs mt-2 rounded bg-black/15 p-2.5 border border-white/10 leading-relaxed font-sans">
            曜日を自動判定し、最適なダイヤを本日優先で表示中。見間違いでの乗り遅れを完全に防止します。
          </p>
        </div>
        <Calendar className="w-10 h-10 opacity-90 text-orange-100 shrink-0 ml-4 hidden sm:block" />
      </header>

      {/* Route selector card */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 border-t-8 border-slate-800 mb-5">
        <label className="block text-gray-500 text-xs font-black mb-3 uppercase tracking-widest">
          路線・系統 選択
        </label>
        <div className="grid grid-cols-1 gap-2.5">
          {MOCK_ROUTES.map((route) => (
            <button
              key={route.id}
              onClick={() => setSelectedRouteId(route.id)}
              className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between transition-all ${
                selectedRouteId === route.id
                  ? 'border-shinki bg-orange-50 text-shinki-dark font-extrabold shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 text-gray-800'
              }`}
            >
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold mr-2 text-white ${
                  route.systemNumber === '30系統' ? 'bg-shinki' :
                  route.systemNumber === '8系統' ? 'bg-indigo-600' : 'bg-emerald-600'
                }`}>
                  {route.systemNumber}
                </span>
                <span className="text-sm tracking-tight">{route.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Day Type Tabs but pre-selected automatically */}
      <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 mb-4 flex">
        <button
          onClick={() => setDayType('weekday')}
          className={`flex-1 py-3 text-center rounded-xl text-sm font-bold transition-all ${
            dayType === 'weekday'
              ? 'bg-gray-900 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          平日ダイヤ
          {new Date().getDay() !== 0 && new Date().getDay() !== 6 && (
            <span className="block text-[10px] opacity-75">【本日】</span>
          )}
        </button>
        <button
          onClick={() => setDayType('saturday')}
          className={`flex-1 py-3 text-center rounded-xl text-sm font-bold transition-all ${
            dayType === 'saturday'
              ? 'bg-blue-600 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          土曜ダイヤ
          {new Date().getDay() === 6 && (
            <span className="block text-[10px] opacity-75">【本日】</span>
          )}
        </button>
        <button
          onClick={() => setDayType('holiday')}
          className={`flex-1 py-3 text-center rounded-xl text-sm font-bold transition-all ${
            dayType === 'holiday'
              ? 'bg-red-600 text-white'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          日祝ダイヤ
          {new Date().getDay() === 0 && (
            <span className="block text-[10px] opacity-75">【本日】</span>
          )}
        </button>
      </div>

      {/* Timetable Panel */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 border-t-8 border-shinki">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100 mb-4">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <span>発車時刻・行先一覧</span>
            <span className="text-xs bg-orange-100 text-shinki-dark px-2.5 py-1 rounded-full font-black">
              先着順
            </span>
          </h3>
          <span className="text-xs text-gray-400 font-bold">行先: {destinationStopName}</span>
        </div>

        {/* Fare & IC Quick Banner */}
        <div 
          onClick={() => setShowICInfo(!showICInfo)}
          className="mb-4 bg-orange-50/75 rounded-2xl p-4 border border-orange-150 cursor-pointer hover:bg-orange-50 flex items-start justify-between"
        >
          <div className="flex gap-2.5 items-start">
            <CreditCard className="w-5 h-5 text-shinki mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-black text-gray-900 leading-none">
                IC決済対応: ICOCA・NicoPa・Suica利用可能
              </p>
              <p className="text-[11px] text-gray-500 mt-1 leading-normal">
                運賃目安: 姫路駅前から 180円〜310円（NicoPaなら約10%割引）
              </p>
            </div>
          </div>
          <Info className="w-4 h-4 text-shinki shrink-0 mt-0.5" />
        </div>

        {showICInfo && (
          <div className="mb-4 bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-1.5 leading-relaxed font-sans">
            <p className="font-bold">🚌 神姫バスのIC対応・各種サービスについて</p>
            <p>※ 姫路エリアを含む神姫バス全線で、全国交通系ICカード（ピタパ・イコカ・乗車Suicaなど）をそのままタッチ精算可能！</p>
            <p>※ <b>神姫バス専用ICカード「NicoPa (ニコパ)」</b>なら、通常の乗車が<b>10%割引</b>になり非常にお得です。さらに平日10〜16時の降車なら「昼間割引（約30%引相当）」も適用されます。</p>
          </div>
        )}

        {/* Timetable main list inside 2 columns for quick scanning */}
        {filteredTimetable.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            この曜日の便はありません。
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTimetable.map((item) => {
              const displayHour = item.hour.toString().padStart(2, '0');
              const displayMinute = item.minute.toString().padStart(2, '0');
              const isLast = item.isLastBus;

              return (
                <div
                  key={item.id}
                  id={`timetable-row-${item.id}`}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                    isLast
                      ? 'bg-red-50 border-2 border-red-350 text-red-950 shadow-sm'
                      : 'hover:bg-gray-50 border border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Big legible digital clock style time */}
                    <div className="flex items-baseline font-mono">
                      <span className={`text-2xl font-black ${isLast ? 'text-red-600' : 'text-gray-900'}`}>
                        {displayHour}
                      </span>
                      <span className={`text-lg px-0.5 ${isLast ? 'text-red-500' : 'text-gray-400'}`}>:</span>
                      <span className={`text-2xl font-black ${isLast ? 'text-red-650' : 'text-gray-900'}`}>
                        {displayMinute}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${
                          currentRoute?.systemNumber === '30系統' ? 'bg-shinki' :
                          currentRoute?.systemNumber === '8系統' ? 'bg-indigo-500' : 'bg-emerald-500'
                        }`}>
                          {item.systemNumber}系統
                        </span>
                        <span className="text-xs font-bold text-gray-500">
                          {item.destination} 行き
                        </span>
                      </div>
                      
                      {/* Interactive fare hint */}
                      <span className="text-[11px] text-gray-400 block font-sans">
                        目安運賃: {
                          selectedRouteId === 'R30' ? '310円' : 
                          selectedRouteId === 'R08' ? '290円' : '280円'
                        } (IC支払大歓迎)
                      </span>
                    </div>
                  </div>

                  {/* Right Action / Caution badge */}
                  <div>
                    {isLast ? (
                      <div className="bg-red-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-4 h-4" />
                        <span>⚠️ 最終便</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                        通常便
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* High visibility notes */}
      <div className="bg-gray-100 rounded-2xl p-4 mt-4 border border-gray-200">
        <h4 className="text-xs font-bold text-gray-700 mb-1 flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> 系統毎の経由停留所:
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          {selectedRouteId === 'R30' && '姫路駅前(北口) ➔ 白銀町 ➔ 辻井 ➔ 新在家本町 ➔ 県立大学工学部前 ➔ ゆめさき台'}
          {selectedRouteId === 'R08' && '姫路駅前(北口) ➔ 白銀町 ➔ 辻井 ➔ 県立大学工学部前 ➔ 書写山ロープウェイ'}
          {selectedRouteId === 'R40' && '姫路駅前(北口) ➔ 白銀町 ➔ 辻井 ➔ 鳥飼'}
        </p>
      </div>
    </div>
  );
}
