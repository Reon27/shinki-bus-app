/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  ArrowRightLeft, 
  Clock, 
  Navigation, 
  MapPin, 
  AlertCircle, 
  Plus, 
  Trash2, 
  CreditCard, 
  Smile,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { MOCK_BUS_STOPS, MOCK_ROUTES, MOCK_ACTIVE_BUSES, MOCK_TIMETABLE } from '../data/mockData';
import { FavoritePair, BusStop, TabType } from '../types';

interface HomeViewProps {
  favorites: FavoritePair[];
  onAddFavorite: (fromId: string, toId: string) => void;
  onRemoveFavorite: (favId: string) => void;
  onNavigateTab: (tab: TabType) => void;
  onNavigateToTimelineWithRoute: (routeId: string) => void;
}

// Fixed calculated boarding departures simulation targeted on user timezone
interface BusCountdownInstance {
  id: string;
  systemNumber: string;
  destination: string;
  fares: number;
  delayMinutes: number;
  remainingSeconds: number; // dynamically ticks down
}

export default function HomeView({
  favorites,
  onAddFavorite,
  onRemoveFavorite,
  onNavigateTab,
  onNavigateToTimelineWithRoute
}: HomeViewProps) {
  const [selectedFavId, setSelectedFavId] = useState<string>(favorites[0]?.id || '');
  const [activeCountdowns, setActiveCountdowns] = useState<BusCountdownInstance[]>([]);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Automatic Holiday / Weekday detection base rules
  const getActualDayType = (): 'weekday' | 'saturday' | 'holiday' => {
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 6 is Saturday
    if (day === 0) return 'holiday';
    if (day === 6) return 'saturday';
    return 'weekday';
  };

  const [dayType, setDayType] = useState<'weekday' | 'saturday' | 'holiday'>(getActualDayType());
  const [simHour, setSimHour] = useState<number>(new Date().getHours());
  const [simMinute, setSimMinute] = useState<number>(new Date().getMinutes());

  // For Adding Custom Favorite Form
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newFromStop, setNewFromStop] = useState<string>('H01');
  const [newToStop, setNewToStop] = useState<string>('H07');
  const [addSuccessMsg, setAddSuccessMsg] = useState<string>('');

  const activeFav = favorites.find((f) => f.id === selectedFavId) || favorites[0];

  // Regulate active selections when lists mutate
  useEffect(() => {
    if (activeFav && !selectedFavId) {
      setSelectedFavId(activeFav.id);
    }
  }, [favorites, activeFav, selectedFavId]);

  // Generate 3 virtual upcoming buses with seconds relative to current moment
  useEffect(() => {
    if (!activeFav) {
      setActiveCountdowns([]);
      return;
    }

    // Determine representative route or generic system based on favorite points
    const fromStop = MOCK_BUS_STOPS.find((s) => s.id === activeFav.fromStopId);
    const toStop = MOCK_BUS_STOPS.find((s) => s.id === activeFav.toStopId);
    
    // Find matching route or fallback to default
    const matchingRoute = MOCK_ROUTES.find(
      (r) => r.stops.includes(activeFav.fromStopId) && r.stops.includes(activeFav.toStopId)
    ) || MOCK_ROUTES[0];

    const fare = matchingRoute.fares[activeFav.toStopId] || 250;

    // Hardcode seconds offset: Bus 1 (approx 4.2 mins), Bus 2 (approx 12.5 mins), Bus 3 (approx 27.8 mins)
    const initialBuses: BusCountdownInstance[] = [
      {
        id: 'C01',
        systemNumber: matchingRoute.systemNumber.replace('系統', ''),
        destination: toStop?.name || '終点',
        fares: fare,
        delayMinutes: 2, // 2 mins delay
        remainingSeconds: 245, // 4 mins 5 seconds
      },
      {
        id: 'C02',
        systemNumber: matchingRoute.systemNumber.replace('系統', '') === '30' ? '8' : '30', // alternate system
        destination: toStop?.name || '終点',
        fares: fare,
        delayMinutes: 0,
        remainingSeconds: 710, // 11 mins 50 seconds
      },
      {
        id: 'C03',
        systemNumber: matchingRoute.systemNumber.replace('系統', ''),
        destination: toStop?.name || '終点',
        fares: fare,
        delayMinutes: 4,
        remainingSeconds: 1620, // 27 mins
      },
    ];

    setActiveCountdowns(initialBuses);

    // Clean up previous ticking interval
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }

    // Tick down every single second for raw precise countdown speed!
    countdownIntervalRef.current = setInterval(() => {
      setActiveCountdowns((prev) => {
        return prev
          .map((bus) => {
            const nextSec = bus.remainingSeconds - 1;
            // If countdown finishes, recycle bus to a new slot further out to keep list endless
            if (nextSec <= -3) {
              return {
                ...bus,
                remainingSeconds: 1800 + Math.floor(Math.random() * 600), // ~30-40 mins future shift
                delayMinutes: Math.floor(Math.random() * 5),
              };
            }
            return {
              ...bus,
              remainingSeconds: nextSec,
            };
          })
          .sort((a, b) => a.remainingSeconds - b.remainingSeconds);
      });
    }, 1000);

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [selectedFavId, activeFav]);

  // Handle addition of custom favorited stop pairs safely
  const handleAddNewFavAction = () => {
    if (newFromStop === newToStop) {
      alert('乗車バス停と降車バス停を同じにすることはできません。');
      return;
    }
    onAddFavorite(newFromStop, newToStop);
    setAddSuccessMsg('マイバス停をお気に入りに追加しました！');
    setTimeout(() => {
      setAddSuccessMsg('');
      setShowAddForm(false);
    }, 1500);
  };

  // Convert pure seconds to readable MM分SS秒
  const formatCountdownText = (secNum: number) => {
    if (secNum < 0) {
      return 'のりばに到着中';
    }
    const minutes = Math.floor(secNum / 60);
    const secs = secNum % 60;
    return (
      <span className="font-mono tracking-tight text-white font-heavy flex items-baseline">
        <span className="text-4xl font-extrabold">{minutes}</span>
        <span className="text-lg font-bold mx-0.5">分</span>
        <span className="text-4xl font-extrabold">{secs.toString().padStart(2, '0')}</span>
        <span className="text-lg font-bold ml-0.5">秒</span>
      </span>
    );
  };

  const currentFromStop = MOCK_BUS_STOPS.find((s) => s.id === activeFav?.fromStopId);
  const currentToStop = MOCK_BUS_STOPS.find((s) => s.id === activeFav?.toStopId);

  // Collect all outgoing departures from the currently chosen departure station chronologically
  const terminalDepartures = (() => {
    if (!currentFromStop) return [];
    
    // Find all route systems that contains this stop except as the last stop.
    const eligibleRoutes = MOCK_ROUTES.filter(r => {
      const idx = r.stops.indexOf(currentFromStop.id);
      return idx !== -1 && idx < r.stops.length - 1;
    });

    const routeSystemNumbers = eligibleRoutes.map(r => r.systemNumber.replace('系統', ''));

    // From MOCK_TIMETABLE, find all matching the dayType and those system numbers
    let matches = MOCK_TIMETABLE.filter(t => 
      t.dayType === dayType && 
      routeSystemNumbers.includes(t.systemNumber)
    );

    // Map them to calculated upcoming instances with simulated delay relative to simHour:simMinute
    return matches.map(m => {
      const r = eligibleRoutes.find(er => er.systemNumber.replace('系統', '') === m.systemNumber);
      
      const scheduledMinutes = m.hour * 60 + m.minute;
      const currentMinutes = simHour * 60 + simMinute;
      let diffMinutes = scheduledMinutes - currentMinutes;
      if (diffMinutes < 0) {
        diffMinutes += 24 * 60; // wraparound 24h
      }

      // Small mock delay based on system number (even is 1m, odd is 3m, 0m etc)
      const mockDelay = (parseInt(m.systemNumber) % 3 === 0) ? 2 : (parseInt(m.systemNumber) % 5 === 0 ? 4 : 0);

      return {
        ...m,
        diffMinutes,
        delayMinutes: mockDelay,
        fare: r ? (r.fares[r.stops[r.stops.length - 1]] || 210) : 210
      };
    })
    .sort((a, b) => a.diffMinutes - b.diffMinutes)
    .slice(0, 5); // Limit to top 5 next departures
  })();

  return (
    <div id="personalized-dashboard-tab" className="pb-24 px-4 pt-4 max-w-lg mx-auto">
      {/* Top Banner introducing customized system */}
      <header className="mb-5 bg-shinki text-white p-6 shadow-lg rounded-3xl flex justify-between items-center">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="bg-white text-shinki font-black px-2.5 py-0.5 rounded text-xs tracking-wider">
              のりば案内
            </span>
            <span className="text-[10px] tracking-widest text-orange-200">REALTIME GPS</span>
          </div>
          <h1 className="text-2xl font-black mt-1.5 tracking-tight font-sans">
            路線バス リアルタイムナビ
          </h1>
          <p className="text-white/90 text-xs mt-2 rounded bg-black/15 p-2.5 border border-white/10 leading-relaxed font-sans">
            現在停留所からのバスの運行時刻・GPS位置・遅延状況を秒単位カウントダウン（本日専用ダイヤ自動同期）。
          </p>
        </div>
        <Smile className="w-10 h-10 opacity-90 text-orange-100 shrink-0 ml-4 hidden sm:block" />
      </header>

      {/* Dynamic Date & Time Simulation Segment */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 mb-5 flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-700 uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-full bg-shinki inline-block animate-pulse" />
            <span>運行ダイヤ判定・曜日切替</span>
          </div>
          <span className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded font-bold font-mono">
            {simHour.toString().padStart(2, '0')}:{simMinute.toString().padStart(2, '0')} 同期中
          </span>
        </div>
        
        {/* Day selection pill control */}
        <div className="grid grid-cols-3 gap-1.5 bg-slate-200/60 p-1 rounded-xl">
          <button
            onClick={() => { setDayType('weekday'); }}
            className={`text-[11px] py-2 rounded-lg font-black transition-all ${
              dayType === 'weekday'
                ? 'bg-shinki text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            平日ダイヤ (今日判定)
          </button>
          <button
            onClick={() => { setDayType('saturday'); }}
            className={`text-[11px] py-2 rounded-lg font-black transition-all ${
              dayType === 'saturday'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            土曜ダイヤ
          </button>
          <button
            onClick={() => { setDayType('holiday'); }}
            className={`text-[11px] py-2 rounded-lg font-black transition-all ${
              dayType === 'holiday'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            日祝ダイヤ
          </button>
        </div>

        {/* Time Simulator Slider */}
        <div className="flex items-center gap-4 bg-white rounded-xl p-3 border border-slate-150">
          <div className="w-full">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
              <span>時間帯テストスライダー (夜でも昼ダイヤをシミュレート可能)</span>
              <span className="text-shinki font-black">{simHour}時 {simMinute}分 指定中</span>
            </div>
            <input 
              type="range"
              min="5"
              max="23"
              value={simHour}
              onChange={(e) => {
                setSimHour(parseInt(e.target.value));
                setSimMinute(Math.floor(Math.random() * 60)); // comfortable minute shift
              }}
              className="w-full accent-shinki cursor-pointer h-1.5 bg-gray-100 rounded-lg appearance-none"
            />
          </div>
          <button
            onClick={() => {
              const d = new Date();
              setSimHour(d.getHours());
              setSimMinute(d.getMinutes());
              setDayType(getActualDayType());
            }}
            className="text-[10px] text-slate-500 font-extrabold bg-slate-100 hover:bg-slate-200 border border-slate-200 py-2.5 px-3 rounded-lg shrink-0"
          >
            自動判定
          </button>
        </div>
      </div>

      {/* Selector of My Bus Stops styled as premium geometric card with bold Orange Top-Border */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-150 border-t-8 border-shinki mb-6">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-shinki fill-shinki" />
            <span>マイバス停（登録区間）</span>
          </label>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-xs font-extrabold text-shinki hover:text-shinki-dark bg-orange-50 px-3 py-2 rounded-xl flex items-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>新規登録</span>
          </button>
        </div>

        {/* Dynamic Add Form Drawer */}
        {showAddForm && (
          <div className="mb-4 bg-orange-50/50 p-5 rounded-2xl border-2 border-dashed border-orange-200">
            <h3 className="text-xs font-black text-orange-950 mb-3 block">お気に入り区間の手動登録</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">乗車バス停</label>
                <select
                  value={newFromStop}
                  onChange={(e) => setNewFromStop(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-white border border-gray-200 rounded-xl text-gray-800"
                >
                  {MOCK_BUS_STOPS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center my-1 text-gray-300">
                <ArrowRightLeft className="w-4 h-4 rotate-90" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 mb-1">降車バス停</label>
                <select
                  value={newToStop}
                  onChange={(e) => setNewToStop(e.target.value)}
                  className="w-full text-xs font-bold p-3 bg-white border border-gray-200 rounded-xl text-gray-800"
                >
                  {MOCK_BUS_STOPS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {addSuccessMsg ? (
                <div className="text-xs text-emerald-605 bg-emerald-50 p-2 rounded border border-emerald-200 font-bold flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{addSuccessMsg}</span>
                </div>
              ) : (
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleAddNewFavAction}
                    className="flex-1 bg-shinki hover:bg-shinki-dark text-white font-bold text-xs py-2.5 rounded-xl transition-colors"
                  >
                    このペアを追加
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 text-xs py-2.5 px-3 rounded-xl transition-colors"
                  >
                    キャンセル
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* List of customized registered points */}
        {favorites.length === 0 ? (
          <div className="text-center py-5 text-gray-400 text-xs">
            お気に入りバス停がありません。上の「新規追加」から登録してください。
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((fav) => {
              const start = MOCK_BUS_STOPS.find((s) => s.id === fav.fromStopId);
              const dest = MOCK_BUS_STOPS.find((s) => s.id === fav.toStopId);
              const isSelected = activeFav?.id === fav.id;

              return (
                <div
                  key={fav.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-shinki bg-orange-50 text-shinki-dark font-heavy shadow-xs'
                      : 'border-gray-150 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <button
                    onClick={() => setSelectedFavId(fav.id)}
                    className="flex-1 text-left flex items-center gap-2"
                  >
                    <span className="text-sm font-extrabold tracking-tight truncate max-w-[280px]">
                      {start?.name} ➔ {dest?.name}
                    </span>
                  </button>

                  {/* Trash action but preserve at least one */}
                  {favorites.length > 1 && (
                    <button
                      onClick={() => onRemoveFavorite(fav.id)}
                      className="text-gray-400 hover:text-red-650 p-1 rounded-lg transition-colors"
                      title="この区間をお気に入りから削除"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Focus: Countdown Card Board */}
      {activeFav ? (
        <div className="space-y-4">
          
          {/* Main first incoming bus board in brilliant orange black */}
          <div className="bg-slate-900 rounded-3xl p-5 shadow-xl border border-gray-800 text-white relative overflow-hidden">
            
            {/* Visual glow element behind */}
            <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-orange-600/30 via-slate-900/0 pointers-events-none" />

            <div className="flex justify-between items-center mb-4">
              <span className="bg-shinki text-white font-black text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                <span className="w-2 h-2 bg-white rounded-full inline-block animate-ping" />
                <span>リアルタイム運行中</span>
              </span>
              <div className="text-left text-[11px] text-gray-400">
                乗車: <span className="text-white font-bold">{currentFromStop?.name}</span>
              </div>
            </div>

            {activeCountdowns.length > 0 ? (
              (() => {
                const headBus = activeCountdowns[0];
                return (
                  <div className="relative z-10">
                    <div className="flex justify-between items-baseline mb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-shinki text-white text-xs px-2.5 py-1 rounded font-black">
                          {headBus.systemNumber}系統
                        </span>
                        <span className="text-sm font-bold text-gray-300">
                          {headBus.destination} 行き
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-[11px] text-gray-400 block">大人運賃</span>
                        <span className="text-2xl font-black italic text-shinki-light tracking-wider">
                          ¥{headBus.fares}
                        </span>
                      </div>
                    </div>

                    {/* BIG COUNTDOWN TIMER */}
                    <div className="my-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center relative">
                      <p className="text-[10px] text-orange-500 font-extrabold tracking-widest mb-1.5 uppercase">
                        発車までの残り時間
                      </p>
                      {formatCountdownText(headBus.remainingSeconds)}

                      {/* Delay Info overlay widget inside */}
                      <div className="mt-3.5 flex items-center gap-2 flex-wrap justify-center">
                        {headBus.delayMinutes > 0 ? (
                          <span className="bg-red-650 text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>運行遅れ約 {headBus.delayMinutes} 分込み</span>
                          </span>
                        ) : (
                          <span className="bg-emerald-600 text-white text-[10px] px-2.5 py-1 rounded-full font-extrabold">
                            道路状況良好 (定時運行)
                          </span>
                        )}

                        <span className="bg-slate-800 text-gray-300 text-[10px] px-2.5 py-1 rounded-full font-bold">
                          NicoPa払い ➔ 四捨五入 ¥{Math.round(headBus.fares * 0.9)} (10%割引)
                        </span>
                      </div>
                    </div>

                    {/* Quick Link to Timeline showing where it is */}
                    <button
                      onClick={() => onNavigateToTimelineWithRoute('R30')}
                      className="w-full text-center bg-shinki hover:bg-shinki-dark py-3.5 rounded-xl font-bold text-xs tracking-wider transition-all shadow-lg active:scale-98"
                    >
                      現在位置を「リアルタイム路線図」で追跡する ➔
                    </button>
                  </div>
                );
              })()
            ) : (
              <div className="text-center py-6 text-gray-450 text-sm">
                バス運行が終了しているか、本日の便はありません。
              </div>
            )}
          </div>

          {/* Secondary upcoming 2 buses */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 border-t-4 border-shinki-light">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-1 pb-2 border-b border-gray-50">
              <Clock className="w-4 h-4 text-shinki" />
              <span>次に来るバス</span>
            </h3>

            {activeCountdowns.length > 1 ? (
              <div className="space-y-3">
                {activeCountdowns.slice(1).map((bus, busIdx) => {
                  const minutesLeft = Math.max(1, Math.round(bus.remainingSeconds / 60));
                  return (
                    <div 
                      key={bus.id}
                      className="flex items-center justify-between p-4 bg-slate-50/75 rounded-2xl border border-slate-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center font-bold text-md text-slate-700 shrink-0">
                          {busIdx + 2}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            系統 [{bus.systemNumber}] {bus.destination}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            大人運賃: ¥{bus.fares} (NicoPa: ¥{Math.round(bus.fares * 0.9)})
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 ml-3">
                        <span className="text-gradient block font-black text-xl text-slate-800 tracking-wider">
                          あと {minutesLeft}分
                        </span>
                        {bus.delayMinutes > 0 ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1 py-0.5 rounded leading-none border border-red-100">
                            {bus.delayMinutes}分遅れ
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 rounded leading-none">
                            定時
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-400 text-xs">
                後発便の予測データはありません。
              </div>
            )}
          </div>

          {/* Terminal Departures先着順 widget (Himeji Station etc) */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 border-t-8 border-slate-800">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100 mb-4">
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin className="w-5 h-5 text-shinki" />
                  <span>【先着順】 {currentFromStop?.name} 発車掲示板</span>
                </h3>
                <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                  こののりばから発車するすべての系統（北部・南部）を時刻順に一覧表示。
                </p>
              </div>
            </div>

            {terminalDepartures.length > 0 ? (
              <div className="space-y-3">
                {terminalDepartures.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className={`relative rounded-3xl p-4 transition-all border ${
                        item.isLastBus
                          ? 'border-red-500 bg-rose-50/50 shadow-xs'
                          : 'border-slate-150 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      {item.isLastBus && (
                        <div className="absolute top-2.5 right-2.5 bg-rose-600 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          🚨 本日の最終便 (終バス)
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-black text-white ${
                            item.isLastBus ? 'bg-red-600' : 'bg-shinki'
                          }`}>
                            {item.systemNumber}系統
                          </span>
                          <div>
                            <p className="text-sm font-extrabold text-slate-800">
                              {item.destination} 行き
                            </p>
                            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                              発車時刻: <span className="font-mono font-bold text-slate-700">{item.hour.toString().padStart(2, '0')}:{item.minute.toString().padStart(2, '0')}</span> 
                              {item.delayMinutes > 0 && <span className="text-red-600 font-bold ml-1">（遅延約{item.delayMinutes}分込み）</span>}
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-sm font-black tracking-tight block ${
                            item.isLastBus ? 'text-rose-650' : 'text-shinki'
                          }`}>
                            あと {item.diffMinutes} 分
                          </span>
                          <span className="text-[10px] text-slate-400">
                            通常 ¥{item.fare} (NicoPa ¥{Math.round(item.fare * 0.9)})
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                シミュレート時間帯において、こののりばからの発車便はありません。上の「時間帯切替スライダー」で朝や夕方に切り替えてみてください。
              </div>
            )}
          </div>

          {/* IC card support banner */}
          <div className="bg-orange-50/60 rounded-2xl p-4 border border-orange-100 flex items-start gap-3">
            <CreditCard className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
            <div className="text-xs text-gray-700 leading-relaxed font-sans">
              <p className="font-bold text-orange-950">小銭の両替は不要です</p>
              <p className="mt-0.5">神姫バスは NicoPa / ICOCA / Suica / PASMO / PiTaPa など、多くの交通系ICカードがご利用可能です。乗車口・降車口のセンサーに優しくタッチしてください。</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-150 p-5 font-sans">
          <HelpCircle className="w-12 h-12 text-orange-200 mx-auto mb-3" />
          <p className="text-gray-800 font-bold mb-2">まだマイ区間が設定されていません</p>
          <p className="text-gray-500 text-xs leading-relaxed">上の「新規追加」を押してお気に入りの乗車バス停と降車バス停をペア登録してください。</p>
        </div>
      )}
    </div>
  );
}
