// ============================================================
//  HydroSense — API Service
//  File: src/utils/api.js
//
//  PHASE 1: Uses mock data
//  PHASE 5: Replace API_BASE with your backend URL and
//           uncomment the real fetch calls
// ============================================================
import axios from 'axios';

// TODO Phase 5: Replace with your deployed backend URL
export const API_BASE = 'https://your-backend-url.com/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// ── MOCK DATA ─────────────────────────────────────────────────
export const MOCK_READINGS = {
  temp: { s1: 22.4, s2: 25.1, s3: 25.7, avg: 24.4 },
  humidity: 62.1,
  ph: 6.29,
  tds: 925,
  status: 'OPTIMAL',
  timestamp: new Date().toISOString(),
};

export const MOCK_LOGS = [
  { id: '1', timestamp: '2/16/2026, 7:11 PM', temp: 26.0,  humidity: 69.7, ph: 6.61, tds: 954, status: 'Optimal' },
  { id: '2', timestamp: '2/16/2026, 6:11 PM', temp: 22.3,  humidity: 58.9, ph: 6.31, tds: 628, status: 'Optimal' },
  { id: '3', timestamp: '2/16/2026, 5:11 PM', temp: 25.1,  humidity: 55.3, ph: 6.35, tds: 713, status: 'Optimal' },
  { id: '4', timestamp: '2/16/2026, 4:11 PM', temp: 23.4,  humidity: 61.9, ph: 6.16, tds: 861, status: 'Optimal' },
  { id: '5', timestamp: '2/16/2026, 3:11 PM', temp: 25.3,  humidity: 55.8, ph: 6.04, tds: 730, status: 'Optimal' },
  { id: '6', timestamp: '2/16/2026, 2:11 PM', temp: 23.5,  humidity: 61.3, ph: 6.96, tds: 925, status: 'Warning' },
  { id: '7', timestamp: '2/16/2026, 1:11 PM', temp: 24.8,  humidity: 63.1, ph: 6.45, tds: 880, status: 'Optimal' },
  { id: '8', timestamp: '2/16/2026, 12:11 PM',temp: 22.9,  humidity: 60.4, ph: 6.22, tds: 760, status: 'Optimal' },
];

export const MOCK_CHART_DATA = {
  temp:     [22.1, 23.5, 24.2, 25.1, 23.8, 24.4, 22.9, 24.4, 25.7, 24.0],
  humidity: [60.0, 63.0, 61.0, 58.0, 65.0, 62.1, 64.0, 62.0, 59.5, 61.8],
  ph:       [6.1,  6.3,  6.5,  6.2,  6.4,  6.29, 6.6,  6.3,  6.1,  6.5],
  tds:      [820,  870,  910,  880,  950,  925,  900,  860,  920,  925],
};

export const MOCK_GROWTH = {
  stage:      'Vegetative',
  confidence: { Seedling: 8, Vegetative: 90, Fruiting: 24 },
  daysToNext: 21,
  harvestDate:'May 5, 2026',
  imageUri:   null, // Will hold camera image URI
};

export const MOCK_SENSORS_HEALTH = [
  { id: 1, name: 'DHT11 Sensor 1', lastReading: '2s ago', status: 'Operational' },
  { id: 2, name: 'DHT11 Sensor 2', lastReading: '2s ago', status: 'Operational' },
  { id: 3, name: 'DHT11 Sensor 3', lastReading: '2s ago', status: 'Operational' },
  { id: 4, name: 'pH Sensor',       lastReading: '5s ago', status: 'Operational' },
  { id: 5, name: 'TDS Sensor',      lastReading: '5s ago', status: 'Operational' },
];

// ── API FUNCTIONS (swap mock → real in Phase 5) ───────────────

export async function getLatestReadings() {
  // Phase 5: return (await api.get('/readings/latest')).data;
  return MOCK_READINGS;
}

export async function getLogs(limit = 50) {
  // Phase 5: return (await api.get(`/readings?limit=${limit}`)).data;
  return MOCK_LOGS;
}

export async function getChartData(variable, hours = 24) {
  // Phase 5: return (await api.get(`/readings/chart?variable=${variable}&hours=${hours}`)).data;
  return MOCK_CHART_DATA[variable] || [];
}

export async function getGrowthClassification(imageBase64) {
  // Phase 5: return (await api.post('/classify', { image: imageBase64 })).data;
  return MOCK_GROWTH;
}

export async function postNutrients(data) {
  // Phase 5: return (await api.post('/nutrients', data)).data;
  return { success: true };
}

export async function getSystemHealth() {
  // Phase 5: return (await api.get('/system/health')).data;
  return {
    esp32Online: true,
    sdUsed:      13.4,
    sdTotal:     32,
    sensors:     MOCK_SENSORS_HEALTH,
  };
}
