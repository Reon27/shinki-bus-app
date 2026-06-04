/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BusStop {
  id: string;
  name: string;
  kana: string;
  lat: number;
  lng: number;
  lines: string[];
}

export interface BusRoute {
  id: string;
  systemNumber: string;
  name: string;
  stops: string[]; // List of stop IDs in order
  fares: Record<string, number>; // fare from departure stop (e.g.,姬路駅前) to target stops
}

export interface ActiveBus {
  id: string;
  routeId: string;
  systemNumber: string;
  destination: string;
  currentSegmentFrom: string; // BusStop ID
  currentSegmentTo: string;   // BusStop ID
  progress: number;          // 0 to 1 representing position between From and To
  delayMinutes: number;      // Delay in minutes
  isCrowded: 'low' | 'medium' | 'high'; // 混雑度: 空いてる, 普通, 混雑
}

export interface TimetableEntry {
  id: string;
  hour: number;
  minute: number;
  systemNumber: string;
  destination: string;
  isLastBus: boolean; // 終バス
  dayType: 'weekday' | 'saturday' | 'holiday';
}

export interface FavoritePair {
  id: string;
  fromStopId: string;
  toStopId: string;
}

export type TabType = 'home' | 'search' | 'timeline' | 'timetable';
