/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusStop, BusRoute, ActiveBus, TimetableEntry, FavoritePair } from '../types';

// Real stops from Shinki Bus Himeji North and South routing maps (100% Japanese)
export const MOCK_BUS_STOPS: BusStop[] = [
  // Himeji Hubs
  { id: 'H01', name: '姫路駅前 (北口)', kana: 'ひめじえきまえきたぐち', lat: 34.8258, lng: 134.6902, lines: ['1系統', '3系統', '5系統', '8系統', '10系統', '11系統', '12系統', '13系統', '21系統', '22系統', '23系統', '24系統', '30系統', '31系統', '32系統', '33系統', '34系統', '35系統', '40系統', '41系統', '42系統', '43系統', '45系統', '51系統', '52系統', '53系統', '61系統', '62系統', '64系統', '71系統', '72系統', '73系統', '74系統', '75系統', '81系統', '82系統', '84系統', '86系統', '88系統'] },
  { id: 'H01S', name: '姫路駅前 (南口)', kana: 'ひめじえきまえみなみぐち', lat: 34.8248, lng: 134.6902, lines: ['91系統', '92系統', '93系統', '94系統', '95系統', '96系統', '98系統', '99系統'] },
  
  // Northside Key Stops
  { id: 'H02', name: '白銀町', kana: 'しろがねちょう', lat: 34.8290, lng: 134.6902, lines: ['1系統', '8系統', '30系統', '40系統'] },
  { id: 'H03', name: '辻井', kana: 'つじい', lat: 34.8450, lng: 134.6750, lines: ['8系統', '30系統', '31系統', '32系統', '33系統', '34系統', '35系統', '40系統'] },
  { id: 'H04', name: '新在家本町', kana: 'しんざいけほんまち', lat: 34.8510, lng: 134.6720, lines: ['30系統', '40系統'] },
  { id: 'H05', name: '県立大学工学部前', kana: 'けんりつだいがくこうがくぶまえ', lat: 34.8580, lng: 134.6650, lines: ['30系統', '8系統', '41系統', '42系統', '43系統', '45系統'] },
  { id: 'H06', name: '書写山ロープウェイ', kana: 'しょしゃざんろーぷうぇい', lat: 34.8780, lng: 134.6580, lines: ['8系統', '10系統'] },
  { id: 'H07', name: 'ゆめさき台', kana: 'ゆめさきだい', lat: 34.8850, lng: 134.6500, lines: ['30系統'] },
  { id: 'H08', name: '鳥飼', kana: 'とりかい', lat: 34.8620, lng: 134.6850, lines: ['40系統'] },
  { id: 'H09', name: '姫路自動学校前', kana: 'ひめじじどうしゃがっこうまえ', lat: 34.8320, lng: 134.7000, lines: ['21系統', '22系統', '23系統', '24系統'] },
  { id: 'H10', name: '姫路獨協大学', kana: 'ひめじどっきょうだいがく', lat: 34.8680, lng: 134.6980, lines: ['3系統', '5系統', '11系統'] },
  { id: 'H11', name: '大寿台', kana: 'だいじゅだい', lat: 34.8720, lng: 134.7010, lines: ['3系統', '5系統', '11系統'] },
  { id: 'H12', name: '北平野東口', kana: 'きたひらのひがしぐち', lat: 34.8550, lng: 134.7020, lines: ['5系統', '3系統'] },
  { id: 'H13', name: '大池台', kana: 'おおいけだい', lat: 34.8650, lng: 134.6790, lines: ['12系統', '13系統'] },
  { id: 'H14', name: '高岡神社前', kana: 'たかおかじんじゃまえ', lat: 34.8420, lng: 134.6620, lines: ['12系統'] },
  { id: 'H15', name: '田寺北口', kana: 'たでらきたぐち', lat: 34.8560, lng: 134.6780, lines: ['12系統', '13系統'] },
  { id: 'H16', name: '鹿島神社', kana: 'かしまじんじゃ', lat: 34.7950, lng: 134.7850, lines: ['21系統'] },
  { id: 'H17', name: '夕陽ヶ丘', kana: 'ゆうひがおか', lat: 34.8050, lng: 134.7700, lines: ['22系統'] },
  { id: 'H18', name: '別所駅', kana: 'べっしょえき', lat: 34.8010, lng: 134.7610, lines: ['22系統'] },
  { id: 'H19', name: '四郷和光保育所東', kana: 'しごうわこうほいくしょひがし', lat: 34.8250, lng: 134.7390, lines: ['23系統', '24系統'] },
  { id: 'H20', name: '山崎 (宍粟)', kana: 'やまさき', lat: 35.0020, lng: 134.5450, lines: ['31系統', '32系統', '33系統', '40系統', '41系統'] },
  { id: 'H21', name: '鹿ヶ壺', kana: 'しかがつぼ', lat: 35.0600, lng: 134.5820, lines: ['34系統'] },
  { id: 'H22', name: '緑台', kana: 'みどりだい', lat: 34.8880, lng: 134.6300, lines: ['35系統', '40系統', '43系統'] },
  { id: 'H23', name: '書写西住宅', kana: 'しょしゃにしじゅうたく', lat: 34.8810, lng: 134.6400, lines: ['40系統', '45系統'] },
  { id: 'H24', name: '荒木', kana: 'あらき', lat: 34.9050, lng: 134.6250, lines: ['41系統'] },
  { id: 'H25', name: 'バーズタウン', kana: 'ばーずたうん', lat: 34.9120, lng: 134.6150, lines: ['42系統'] },
  { id: 'H26', name: '前之庄', kana: 'まえのしょう', lat: 34.9750, lng: 134.6850, lines: ['51系統', '52系統', '53系統'] },
  { id: 'H27', name: 'ヤマサ蒲鉾前', kana: 'やまさかまぼこまえ', lat: 34.9450, lng: 134.6750, lines: ['51系統', '53系統'] },
  { id: 'H28', name: '杉之内', kana: 'すぎのうち', lat: 34.9850, lng: 134.6900, lines: ['52系統'] },
  { id: 'H29', name: '北条営業所', kana: 'ほうじょうえいぎょうしょ', lat: 34.9250, lng: 134.8300, lines: ['61系統', '62系統', '88系統'] },
  { id: 'H30', name: '城見台', kana: 'しろみだい', lat: 34.8550, lng: 134.7450, lines: ['64系統', '75系統'] },
  { id: 'H31', name: '社 (車庫前)', kana: 'やしろしゃこまえ', lat: 34.9200, lng: 134.9700, lines: ['71系統', '72系統'] },
  { id: 'H32', name: '社町駅', kana: 'やしろまちえき', lat: 34.9150, lng: 134.9800, lines: ['73系統'] },
  { id: 'H33', name: '姫路セントラルパーク', kana: 'ひめじせんとらるぱーく', lat: 34.8650, lng: 134.7950, lines: ['74系統'] },
  { id: 'H34', name: '福崎駅前', kana: 'ふくざきえきまえ', lat: 34.9580, lng: 134.7620, lines: ['84系統'] },
  { id: 'H35', name: 'マリア病院', kana: 'まりあびょういん', lat: 34.8480, lng: 134.7150, lines: ['81系統', '82系統', '84系統', '86系統', '88系統'] },
  { id: 'H36', name: '江鮒団地', kana: 'えふなだんち', lat: 34.8850, lng: 134.7320, lines: ['81系統'] },
  
  // Southside Key Stops
  { id: 'H37', name: '山電飾磨駅', kana: 'さんでんしかまえき', lat: 34.7980, lng: 134.6750, lines: ['91系統'] },
  { id: 'H38', name: '姫路火力', kana: 'ひめじかりょく', lat: 34.7750, lng: 134.6800, lines: ['91系統'] },
  { id: 'H39', name: '姫路検査場', kana: 'ひめじけんさじょう', lat: 34.7850, lng: 134.6710, lines: ['91系統'] },
  { id: 'H40', name: '宇佐崎南', kana: 'うさざきみなみ', lat: 34.7950, lng: 134.7350, lines: ['92系統'] },
  { id: 'H41', name: '姫路まえどれ市場', kana: 'ひめじまえどれいちば', lat: 34.7850, lng: 134.7200, lines: ['92系統'] },
  { id: 'H42', name: '白浜の宮駅', kana: 'しらはまのみやえき', lat: 34.7990, lng: 134.7250, lines: ['92系統'] },
  { id: 'H43', name: '的形循環', kana: 'まとがたじゅんかん', lat: 34.7850, lng: 134.7550, lines: ['93系統'] },
  { id: 'H44', name: '姫路港', kana: 'ひめじこう', lat: 34.7780, lng: 134.6950, lines: ['94系統'] },
  { id: 'H45', name: 'はりま勝原駅', kana: 'はりまかつはらえき', lat: 34.8120, lng: 134.6310, lines: ['95系統'] },
  { id: 'H46', name: '下太田住宅', kana: 'しもおおたじゅうたく', lat: 34.8180, lng: 134.6180, lines: ['95系統'] },
  { id: 'H47', name: 'JR網干駅', kana: 'じぇいあーるあぼしえき', lat: 34.8210, lng: 134.5950, lines: ['96系統'] },
  { id: 'H48', name: '長久病院前', kana: 'ちょうきゅうびょういんまえ', lat: 34.8050, lng: 134.6520, lines: ['96系統'] },
  { id: 'H49', name: '庄田', kana: 'しょうだ', lat: 34.8150, lng: 134.7060, lines: ['98系統'] },
  { id: 'H50', name: '姫路市役所前', kana: 'ひめじしやくしょまえ', lat: 34.8180, lng: 134.6980, lines: ['98系統', '99系統'] }
];

// Fully populated Shinki Bus routes representing real systems in visual diagrams (100% Japanese)
export const MOCK_ROUTES: BusRoute[] = [
  // Himeji North exiting routes
  {
    id: 'R01',
    systemNumber: '1系統',
    name: '今宿循環（姫路駅前〜東雲町〜下手野〜今宿〜姫路駅前）',
    stops: ['H01', 'H02', 'H03', 'H08', 'H01'],
    fares: { 'H01': 0, 'H02': 180, 'H03': 220, 'H08': 250 }
  },
  {
    id: 'R03',
    systemNumber: '3系統',
    name: '姫路駅前〜平野南口〜姫路獨協大学〜大寿台線',
    stops: ['H01', 'H12', 'H10', 'H11'],
    fares: { 'H01': 0, 'H12': 210, 'H10': 270, 'H11': 290 }
  },
  {
    id: 'R05',
    systemNumber: '5系統',
    name: '姫路駅前〜北平野東口〜姫路獨協大学〜大寿台線',
    stops: ['H01', 'H12', 'H10', 'H11'],
    fares: { 'H01': 0, 'H12': 210, 'H10': 270, 'H11': 290 }
  },
  {
    id: 'R08',
    systemNumber: '8系統',
    name: '姫路駅前〜新在家〜県立大〜書写山ロープウェイ線',
    stops: ['H01', 'H02', 'H03', 'H05', 'H06'],
    fares: { 'H01': 0, 'H02': 180, 'H03': 220, 'H05': 270, 'H06': 290 }
  },
  {
    id: 'R10',
    systemNumber: '10系統',
    name: '姫路駅前〜西高前〜書写山ロープウェイ急行線',
    stops: ['H01', 'H06'],
    fares: { 'H01': 0, 'H06': 290 }
  },
  {
    id: 'R11',
    systemNumber: '11系統',
    name: '姫路駅前〜西八代〜独協大学〜大寿台線',
    stops: ['H01', 'H12', 'H10', 'H11'],
    fares: { 'H01': 0, 'H12': 210, 'H10': 270, 'H11': 290 }
  },
  {
    id: 'R12',
    systemNumber: '12系統',
    name: '姫路駅前〜新在家６丁目〜高岡神社〜大池台線',
    stops: ['H01', 'H14', 'H15', 'H13'],
    fares: { 'H01': 0, 'H14': 200, 'H15': 220, 'H13': 240 }
  },
  {
    id: 'R13',
    systemNumber: '13系統',
    name: '姫路駅前〜下池〜田寺北口〜大池台線',
    stops: ['H01', 'H15', 'H13'],
    fares: { 'H01': 0, 'H15': 220, 'H13': 240 }
  },
  {
    id: 'R21',
    systemNumber: '21系統',
    name: '姫路駅前〜別所〜鹿島神社線',
    stops: ['H01', 'H09', 'H18', 'H16'],
    fares: { 'H01': 0, 'H09': 180, 'H18': 260, 'H16': 310 }
  },
  {
    id: 'R22',
    systemNumber: '22系統',
    name: '姫路駅前〜夕陽ヶ丘・別所駅循環線',
    stops: ['H01', 'H09', 'H18', 'H17'],
    fares: { 'H01': 0, 'H09': 180, 'H18': 260, 'H17': 280 }
  },
  {
    id: 'R23',
    systemNumber: '23系統',
    name: '姫路駅前〜天神前経由 四郷和光保育所東線',
    stops: ['H01', 'H09', 'H19'],
    fares: { 'H01': 0, 'H09': 180, 'H19': 250 }
  },
  {
    id: 'R24',
    systemNumber: '24系統',
    name: '姫路駅前〜市川台経由 四郷和光保育所東線',
    stops: ['H01', 'H09', 'H19'],
    fares: { 'H01': 0, 'H09': 180, 'H19': 250 }
  },
  {
    id: 'R30',
    systemNumber: '30系統',
    name: '姫路駅前〜新在家〜ゆめさき台線',
    stops: ['H01', 'H02', 'H03', 'H04', 'H05', 'H07'],
    fares: { 'H01': 0, 'H02': 180, 'H03': 220, 'H04': 250, 'H05': 270, 'H07': 310 }
  },
  {
    id: 'R31',
    systemNumber: '31系統',
    name: '姫路駅前〜青山〜林田〜山崎線',
    stops: ['H01', 'H02', 'H03', 'H20'],
    fares: { 'H01': 0, 'H02': 180, 'H03': 220, 'H20': 550 }
  },
  {
    id: 'R35',
    systemNumber: '35系統',
    name: '姫路駅前〜上手野〜打越経由 緑台線',
    stops: ['H01', 'H02', 'H03', 'H22'],
    fares: { 'H01': 0, 'H02': 180, 'H03': 220, 'H22': 280 }
  },
  {
    id: 'R40',
    systemNumber: '40系統',
    name: '姫路駅前〜上手野〜西住宅〜緑台〜辻井〜鳥飼線',
    stops: ['H01', 'H02', 'H03', 'H08', 'H23', 'H22', 'H20'],
    fares: { 'H01': 0, 'H02': 180, 'H03': 220, 'H08': 240, 'H23': 290, 'H22': 310, 'H20': 550 }
  },
  {
    id: 'R51',
    systemNumber: '51系統',
    name: '姫路駅前〜名古山〜塩田〜前之庄線',
    stops: ['H01', 'H27', 'H29', 'H26'],
    fares: { 'H01': 0, 'H27': 380, 'H29': 450, 'H26': 520 }
  },
  {
    id: 'R61',
    systemNumber: '61系統',
    name: '姫路駅前〜野里駅前〜南山田〜北条営業所線',
    stops: ['H01', 'H30', 'H29'],
    fares: { 'H01': 0, 'H30': 230, 'H29': 410 }
  },
  {
    id: 'R71',
    systemNumber: '71系統',
    name: '姫路駅前〜小原〜奥猫尾〜社(車庫前)線',
    stops: ['H01', 'H31'],
    fares: { 'H01': 0, 'H31': 630 }
  },
  {
    id: 'R81',
    systemNumber: '81系統',
    name: '姫路駅前〜マリア病院〜江鮒団地線',
    stops: ['H01', 'H35', 'H36'],
    fares: { 'H01': 0, 'H35': 210, 'H36': 290 }
  },

  // Himeji South exiting routes
  {
    id: 'R91',
    systemNumber: '91系統',
    name: '姫路駅前（南口）〜山電飾磨駅〜姫路火力線',
    stops: ['H01S', 'H37', 'H39', 'H38'],
    fares: { 'H01S': 0, 'H37': 220, 'H39': 240, 'H38': 250 }
  },
  {
    id: 'R92',
    systemNumber: '92系統',
    name: '姫路駅前（南口）〜白浜海岸〜宇佐崎南線',
    stops: ['H01S', 'H40', 'H42', 'H41'],
    fares: { 'H01S': 0, 'H40': 240, 'H42': 270, 'H41': 280 }
  },
  {
    id: 'R93',
    systemNumber: '93系統',
    name: '姫路駅前（南口）〜的形循環線',
    stops: ['H01S', 'H43'],
    fares: { 'H01S': 0, 'H43': 310 }
  },
  {
    id: 'R94',
    systemNumber: '94系統',
    name: '姫路駅前（南口）〜手柄〜姫路港線',
    stops: ['H01S', 'H44'],
    fares: { 'H01S': 0, 'H44': 270 }
  },
  {
    id: 'R95',
    systemNumber: '95系統',
    name: '姫路駅前（南口）〜はりま勝原駅〜下太田住宅線',
    stops: ['H01S', 'H45', 'H46'],
    fares: { 'H01S': 0, 'H45': 290, 'H46': 310 }
  },
  {
    id: 'R96',
    systemNumber: '96系統',
    name: '姫路駅前（南口）〜姫路南高校〜JR網干駅線',
    stops: ['H01S', 'H48', 'H47'],
    fares: { 'H01S': 0, 'H48': 260, 'H47': 330 }
  },
  {
    id: 'R98',
    systemNumber: '98系統',
    name: '姫路駅前（南口）〜市役所前〜庄田循環線',
    stops: ['H01S', 'H50', 'H49', 'H01S'],
    fares: { 'H01S': 0, 'H50': 180, 'H49': 180 }
  },
  {
    id: 'R99',
    systemNumber: '99系統',
    name: '姫路駅前（南口）〜市役所前〜市役所南線',
    stops: ['H01S', 'H50'],
    fares: { 'H01S': 0, 'H50': 180 }
  }
];

// Active buses simulating current progress with coordinates & delays
export const MOCK_ACTIVE_BUSES: ActiveBus[] = [
  {
    id: 'B01',
    routeId: 'R30',
    systemNumber: '30系統',
    destination: 'ゆめさき台 行き',
    currentSegmentFrom: 'H02', // 白銀町
    currentSegmentTo: 'H03',   // 辻井
    progress: 0.65,
    delayMinutes: 2,
    isCrowded: 'medium'
  },
  {
    id: 'B02',
    routeId: 'R08',
    systemNumber: '8系統',
    destination: '書写山ロープウェイ 行き',
    currentSegmentFrom: 'H03', // 辻井
    currentSegmentTo: 'H05',   // 県立大学工学部前
    progress: 0.25,
    delayMinutes: 0,
    isCrowded: 'low'
  },
  {
    id: 'B03',
    routeId: 'R31',
    systemNumber: '31系統',
    destination: '山崎 行き',
    currentSegmentFrom: 'H03', // 辻井
    currentSegmentTo: 'H20',   // 山崎
    progress: 0.45,
    delayMinutes: 4,
    isCrowded: 'high'
  },
  {
    id: 'B04',
    routeId: 'R40',
    systemNumber: '40系統',
    destination: '緑台・山崎 行き',
    currentSegmentFrom: 'H01', // 姫路駅前
    currentSegmentTo: 'H02',   // 白銀町
    progress: 0.8,
    delayMinutes: 1,
    isCrowded: 'low'
  },
  {
    id: 'B05',
    routeId: 'R91',
    systemNumber: '91系統',
    destination: '姫路火力 行き',
    currentSegmentFrom: 'H01S', // 姫路駅前(南口)
    currentSegmentTo: 'H37',    // 山電飾磨駅
    progress: 0.3,
    delayMinutes: 3,
    isCrowded: 'medium'
  },
  {
    id: 'B06',
    routeId: 'R92',
    systemNumber: '92系統',
    destination: '宇佐崎南 行き',
    currentSegmentFrom: 'H01S', // 姫路駅前(南口)
    currentSegmentTo: 'H40',    // 宇佐崎南
    progress: 0.6,
    delayMinutes: 0,
    isCrowded: 'low'
  }
];

// Generates high variety timetables for weekdays, saturdays, and holidays with terminal last-bus alarm values
export const MOCK_TIMETABLE: TimetableEntry[] = [
  // 1系統 (Weekday / Saturday / Holiday)
  { id: 'T1_1', hour: 6, minute: 45, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T1_2', hour: 7, minute: 15, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T1_3', hour: 8, minute: 0, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T1_4', hour: 12, minute: 20, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T1_5', hour: 17, minute: 40, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T1_6', hour: 20, minute: 15, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T1_7', hour: 21, minute: 30, systemNumber: '1', destination: '今宿循環', isLastBus: true, dayType: 'weekday' }, // 終バス
  
  { id: 'T1_8', hour: 7, minute: 40, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'saturday' },
  { id: 'T1_9', hour: 11, minute: 40, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'saturday' },
  { id: 'T1_10', hour: 16, minute: 40, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'saturday' },
  { id: 'T1_11', hour: 20, minute: 10, systemNumber: '1', destination: '今宿循環', isLastBus: true, dayType: 'saturday' }, // 終バス

  { id: 'T1_12', hour: 8, minute: 30, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'holiday' },
  { id: 'T1_13', hour: 13, minute: 30, systemNumber: '1', destination: '今宿循環', isLastBus: false, dayType: 'holiday' },
  { id: 'T1_14', hour: 18, minute: 30, systemNumber: '1', destination: '今宿循環', isLastBus: true, dayType: 'holiday' }, // 終バス

  // 3系統 (平日・土日も含めて大寿台行)
  { id: 'T3_1', hour: 7, minute: 0, systemNumber: '3', destination: '大寿台', isLastBus: false, dayType: 'weekday' },
  { id: 'T3_2', hour: 7, minute: 40, systemNumber: '3', destination: '大寿台', isLastBus: false, dayType: 'weekday' },
  { id: 'T3_3', hour: 8, minute: 20, systemNumber: '3', destination: '大寿台', isLastBus: false, dayType: 'weekday' },
  { id: 'T3_4', hour: 14, minute: 15, systemNumber: '3', destination: '大寿台', isLastBus: false, dayType: 'weekday' },
  { id: 'T3_5', hour: 18, minute: 35, systemNumber: '3', destination: '大寿台', isLastBus: false, dayType: 'weekday' },
  { id: 'T3_6', hour: 21, minute: 40, systemNumber: '3', destination: '大寿台', isLastBus: true, dayType: 'weekday' },

  // 8系統 (書写山ロープウェイ方面 - 姫路北部の大動脈)
  { id: 'T8_1', hour: 7, minute: 5, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_2', hour: 7, minute: 35, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_3', hour: 8, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_4', hour: 8, minute: 50, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_5', hour: 10, minute: 40, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_6', hour: 12, minute: 40, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_7', hour: 14, minute: 40, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_8', hour: 16, minute: 40, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_9', hour: 18, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_10', hour: 19, minute: 20, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_11', hour: 20, minute: 45, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'weekday' },
  { id: 'T8_12', hour: 22, minute: 15, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: true, dayType: 'weekday' },

  { id: 'T8_13', hour: 8, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'saturday' },
  { id: 'T8_14', hour: 10, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'saturday' },
  { id: 'T8_15', hour: 12, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'saturday' },
  { id: 'T8_16', hour: 14, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'saturday' },
  { id: 'T8_17', hour: 16, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'saturday' },
  { id: 'T8_18', hour: 18, minute: 10, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'saturday' },
  { id: 'T8_19', hour: 21, minute: 0, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: true, dayType: 'saturday' },

  { id: 'T8_20', hour: 9, minute: 0, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'holiday' },
  { id: 'T8_21', hour: 11, minute: 0, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'holiday' },
  { id: 'T8_22', hour: 13, minute: 0, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'holiday' },
  { id: 'T8_23', hour: 15, minute: 0, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'holiday' },
  { id: 'T8_24', hour: 17, minute: 0, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: false, dayType: 'holiday' },
  { id: 'T8_25', hour: 19, minute: 30, systemNumber: '8', destination: '書写山ロープウェイ', isLastBus: true, dayType: 'holiday' },

  // 30系統 (ゆめさき台方面 - 平日・土・祝)
  { id: 'T30_1', hour: 7, minute: 10, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_2', hour: 7, minute: 50, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_3', hour: 8, minute: 30, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_4', hour: 11, minute: 15, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_5', hour: 15, minute: 25, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_6', hour: 17, minute: 10, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_7', hour: 18, minute: 50, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_8', hour: 20, minute: 20, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'weekday' },
  { id: 'T30_9', hour: 22, minute: 0, systemNumber: '30', destination: 'ゆめさき台', isLastBus: true, dayType: 'weekday' },

  { id: 'T30_10', hour: 8, minute: 0, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'saturday' },
  { id: 'T30_11', hour: 12, minute: 0, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'saturday' },
  { id: 'T30_12', hour: 16, minute: 0, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'saturday' },
  { id: 'T30_13', hour: 21, minute: 15, systemNumber: '30', destination: 'ゆめさき台', isLastBus: true, dayType: 'saturday' },

  { id: 'T30_14', hour: 8, minute: 45, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'holiday' },
  { id: 'T30_15', hour: 13, minute: 45, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'holiday' },
  { id: 'T30_16', hour: 17, minute: 45, systemNumber: '30', destination: 'ゆめさき台', isLastBus: false, dayType: 'holiday' },
  { id: 'T30_17', hour: 20, minute: 45, systemNumber: '30', destination: 'ゆめさき台', isLastBus: true, dayType: 'holiday' },

  // 31系統・32系統 (山崎方面)
  { id: 'T31_1', hour: 7, minute: 20, systemNumber: '31', destination: '山崎 (宍粟)', isLastBus: false, dayType: 'weekday' },
  { id: 'T31_2', hour: 11, minute: 30, systemNumber: '31', destination: '山崎 (宍粟)', isLastBus: false, dayType: 'weekday' },
  { id: 'T31_3', hour: 16, minute: 15, systemNumber: '31', destination: '山崎 (宍粟)', isLastBus: false, dayType: 'weekday' },
  { id: 'T31_4', hour: 19, minute: 45, systemNumber: '31', destination: '山崎 (宍粟)', isLastBus: true, dayType: 'weekday' },

  // 40系統 (終バスが早い山岳・新地区線)
  { id: 'T40_1', hour: 7, minute: 10, systemNumber: '40', destination: '書写西住宅', isLastBus: false, dayType: 'weekday' },
  { id: 'T40_2', hour: 12, minute: 15, systemNumber: '40', destination: '緑台', isLastBus: false, dayType: 'weekday' },
  { id: 'T40_3', hour: 17, minute: 30, systemNumber: '40', destination: '山崎 (宍粟)', isLastBus: false, dayType: 'weekday' },
  { id: 'T40_4', hour: 19, minute: 0, systemNumber: '40', destination: '山崎 (宍粟)', isLastBus: true, dayType: 'weekday' },

  { id: 'T40_5', hour: 9, minute: 15, systemNumber: '40', destination: '書写西住宅', isLastBus: false, dayType: 'saturday' },
  { id: 'T40_6', hour: 16, minute: 15, systemNumber: '40', destination: '緑台', isLastBus: true, dayType: 'saturday' },

  { id: 'T40_7', hour: 10, minute: 0, systemNumber: '40', destination: '書写西住宅', isLastBus: true, dayType: 'holiday' },

  // 51系統・52系統 (前之庄・塩田方面)
  { id: 'T51_1', hour: 6, minute: 50, systemNumber: '51', destination: '前之庄', isLastBus: false, dayType: 'weekday' },
  { id: 'T51_2', hour: 13, minute: 20, systemNumber: '51', destination: '前之庄', isLastBus: false, dayType: 'weekday' },
  { id: 'T51_3', hour: 18, minute: 10, systemNumber: '51', destination: '前之庄', isLastBus: false, dayType: 'weekday' },
  { id: 'T51_4', hour: 20, minute: 30, systemNumber: '51', destination: '前之庄', isLastBus: true, dayType: 'weekday' },

  // 61系統 (北条・城見台方面)
  { id: 'T61_1', hour: 7, minute: 30, systemNumber: '61', destination: '北条営業所', isLastBus: false, dayType: 'weekday' },
  { id: 'T61_2', hour: 14, minute: 10, systemNumber: '61', destination: '北条営業所', isLastBus: false, dayType: 'weekday' },
  { id: 'T61_3', hour: 19, minute: 50, systemNumber: '61', destination: '北条営業所', isLastBus: true, dayType: 'weekday' },

  // 71系統・72系統 (社・セントラルパーク方面 - 土日祝運行の特別ダイヤ)
  { id: 'T71_1', hour: 8, minute: 15, systemNumber: '71', destination: '社 (車庫前)', isLastBus: false, dayType: 'weekday' },
  { id: 'T71_2', hour: 16, minute: 45, systemNumber: '71', destination: '社 (車庫前)', isLastBus: true, dayType: 'weekday' },
  
  { id: 'T71_3', hour: 8, minute: 30, systemNumber: '71', destination: '社 (車庫前)', isLastBus: false, dayType: 'saturday' },
  { id: 'T71_4', hour: 12, minute: 0, systemNumber: '71', destination: '社 (車庫前)', isLastBus: false, dayType: 'saturday' },
  { id: 'T71_5', hour: 17, minute: 15, systemNumber: '71', destination: '社 (車庫前)', isLastBus: true, dayType: 'saturday' },

  { id: 'T71_6', hour: 8, minute: 30, systemNumber: '71', destination: '社 (車庫前)', isLastBus: false, dayType: 'holiday' },
  { id: 'T71_7', hour: 12, minute: 0, systemNumber: '71', destination: '社 (車庫前)', isLastBus: false, dayType: 'holiday' },
  { id: 'T71_8', hour: 17, minute: 15, systemNumber: '71', destination: '社 (車庫前)', isLastBus: true, dayType: 'holiday' }, // 土日祝は増発 & 週末レジャー対応

  // 81系統 (マリア病院・江鮒団地方面)
  { id: 'T81_1', hour: 7, minute: 25, systemNumber: '81', destination: '江鮒団地', isLastBus: false, dayType: 'weekday' },
  { id: 'T81_2', hour: 11, minute: 50, systemNumber: '81', destination: '江鮒団地', isLastBus: false, dayType: 'weekday' },
  { id: 'T81_3', hour: 17, minute: 35, systemNumber: '81', destination: '江鮒団地', isLastBus: false, dayType: 'weekday' },
  { id: 'T81_4', hour: 19, minute: 50, systemNumber: '81', destination: '江鮒団地', isLastBus: true, dayType: 'weekday' },

  // --- SOUTHSIDE TERMINALS (9x Series) ---
  
  // 91系統 (南口・山電飾磨駅・姫路火力)
  { id: 'T91_1', hour: 6, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'weekday' },
  { id: 'T91_2', hour: 7, minute: 10, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'weekday' },
  { id: 'T91_3', hour: 8, minute: 20, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'weekday' },
  { id: 'T91_4', hour: 12, minute: 15, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'weekday' },
  { id: 'T91_5', hour: 17, minute: 50, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'weekday' },
  { id: 'T91_6', hour: 20, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'weekday' },
  { id: 'T91_7', hour: 22, minute: 10, systemNumber: '91', destination: '姫路火力', isLastBus: true, dayType: 'weekday' },

  { id: 'T91_8', hour: 7, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'saturday' },
  { id: 'T91_9', hour: 12, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'saturday' },
  { id: 'T91_10', hour: 17, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'saturday' },
  { id: 'T91_11', hour: 20, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: true, dayType: 'saturday' },

  { id: 'T91_12', hour: 8, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'holiday' },
  { id: 'T91_13', hour: 14, minute: 30, systemNumber: '91', destination: '姫路火力', isLastBus: false, dayType: 'holiday' },
  { id: 'T91_14', hour: 19, minute: 45, systemNumber: '91', destination: '姫路火力', isLastBus: true, dayType: 'holiday' },

  // 92系統 (南口・白浜・宇佐崎南)
  { id: 'T92_1', hour: 7, minute: 5, systemNumber: '92', destination: '宇佐崎南', isLastBus: false, dayType: 'weekday' },
  { id: 'T92_2', hour: 8, minute: 15, systemNumber: '92', destination: '宇佐崎南', isLastBus: false, dayType: 'weekday' },
  { id: 'T92_3', hour: 13, minute: 40, systemNumber: '92', destination: '宇佐崎南', isLastBus: false, dayType: 'weekday' },
  { id: 'T92_4', hour: 18, minute: 20, systemNumber: '92', destination: '宇佐崎南', isLastBus: false, dayType: 'weekday' },
  { id: 'T92_5', hour: 21, minute: 15, systemNumber: '92', destination: '宇佐崎南', isLastBus: true, dayType: 'weekday' },

  // 93系統 (的形循環)
  { id: 'T93_1', hour: 7, minute: 45, systemNumber: '93', destination: '的形循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T93_2', hour: 12, minute: 45, systemNumber: '93', destination: '的形循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T93_3', hour: 18, minute: 15, systemNumber: '93', destination: '的形循環', isLastBus: true, dayType: 'weekday' },

  // 94系統 (姫路港 - 四国・小豆島航路同期)
  { id: 'T94_1', hour: 6, minute: 15, systemNumber: '94', destination: '姫路港', isLastBus: false, dayType: 'weekday' },
  { id: 'T94_2', hour: 9, minute: 45, systemNumber: '94', destination: '姫路港', isLastBus: false, dayType: 'weekday' },
  { id: 'T94_3', hour: 14, minute: 30, systemNumber: '94', destination: '姫路港', isLastBus: false, dayType: 'weekday' },
  { id: 'T94_4', hour: 19, minute: 15, systemNumber: '94', destination: '姫路港', isLastBus: true, dayType: 'weekday' },

  // 95系統 (はりま勝原・下太田)
  { id: 'T95_1', hour: 7, minute: 20, systemNumber: '95', destination: '下太田住宅', isLastBus: false, dayType: 'weekday' },
  { id: 'T95_2', hour: 15, minute: 10, systemNumber: '95', destination: '下太田住宅', isLastBus: false, dayType: 'weekday' },
  { id: 'T95_3', hour: 19, minute: 30, systemNumber: '95', destination: '下太田住宅', isLastBus: true, dayType: 'weekday' },

  // 96系統 (網干)
  { id: 'T96_1', hour: 7, minute: 0, systemNumber: '96', destination: 'JR網干駅', isLastBus: false, dayType: 'weekday' },
  { id: 'T96_2', hour: 13, minute: 0, systemNumber: '96', destination: 'JR網干駅', isLastBus: false, dayType: 'weekday' },
  { id: 'T96_3', hour: 18, minute: 45, systemNumber: '96', destination: 'JR網干駅', isLastBus: true, dayType: 'weekday' },

  // 98系統 (市役所前・庄田循環)
  { id: 'T98_1', hour: 7, minute: 30, systemNumber: '98', destination: '庄田循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T98_2', hour: 12, minute: 30, systemNumber: '98', destination: '庄田循環', isLastBus: false, dayType: 'weekday' },
  { id: 'T98_3', hour: 17, minute: 30, systemNumber: '98', destination: '庄田循環', isLastBus: true, dayType: 'weekday' }
];

export const DEFAULT_FAVORITES: FavoritePair[] = [
  { id: 'F01', fromStopId: 'H01', toStopId: 'H06' },  // 姫路駅前 (北口) -> 書写山ロープウェイ
  { id: 'F02', fromStopId: 'H01', toStopId: 'H07' },  // 姫路駅前 (北口) -> ゆめさき台
  { id: 'F03', fromStopId: 'H01S', toStopId: 'H38' }  // 姫路駅前 (南口) -> 姫路火力
];
