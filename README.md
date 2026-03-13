# 🌿 Hydrosense

**Smart Hydroponic Monitoring System** — A React Native (Expo) app for real-time plant health tracking, AI-powered growth classification, and ESP32 sensor integration.

---

## 📱 Screenshots

| Dashboard | Monitoring | Camera AI | Logs | Health |
|:---------:|:----------:|:---------:|:----:|:------:|
| Sensor cards, growth stage, alerts | Live charts per variable | Photo capture + stage classifier | Historical data table | ESP32 + sensor diagnostics |

---

## ✨ Features

- **Real-time sensor dashboard** — Temperature (3× DHT11 averaged), Humidity, pH, and TDS displayed in a clean 4-card layout
- **Interactive monitoring** — Time-range tabs (1h / 6h / 24h / 7d) with VictoryLine sparkline charts per sensor
- **AI plant classifier** — Captures a plant photo, sends it to a TensorFlow Lite or Flask model, and returns the current growth stage (Seedling / Vegetative / Fruiting) with confidence percentages
- **Nutrient adjustment guide** — Auto-calculates whether Nitrogen, Phosphorus, and Potassium need to increase or decrease based on the detected growth stage
- **Sensor logs** — Filterable historical table (Optimal / Warning / Critical) with timestamps
- **System health** — ESP32 online status, SD card usage bar, per-sensor operational dots, Firebase + backend connectivity
- **Push notifications** — Expo Notifications alert when any sensor drifts outside its optimal range
- **Offline caching** — Last readings cached via AsyncStorage for use when the backend is unreachable

---

## 🗂️ Project Structure

```
HydroSense/
├── app/                          # Expo Router — all screens live here
│   ├── _layout.tsx               # Root layout: bottom tab navigator
│   ├── index.tsx                 # Dashboard (home screen)
│   ├── monitoring.tsx            # Sensor charts & readings
│   ├── camera.tsx                # Camera capture + AI classification
│   ├── logs.tsx                  # Historical data table
│   └── health.tsx                # System hardware diagnostics
├── src/
│   ├── components/
│   │   └── SharedComponents.tsx  # Card, Badge, SensorBar, AlertBanner…
│   └── utils/
│       ├── theme.ts              # Colors, spacing, optimal ranges
│       └── api.ts                # API functions (mock → real in Phase 5)
├── assets/                       # Icons, images, fonts
├── app.json                      # Expo project config
├── package.json                  # Dependencies (main → expo-router/entry)
└── tsconfig.json                 # TypeScript config
```

> **Note:** This project uses **Expo Router** with `app/index.tsx` as the entry point — not the legacy `App.js` pattern. Do not create an `App.js` file.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone ([iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent))

### Install & Run

```bash
# 1. Clone the repository
git clone https://github.com/your-username/HydroSense.git
cd HydroSense

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start

# 4. Scan the QR code with Expo Go on your phone
```

> Phase 1 runs entirely on mock data — no hardware or backend needed to see the full UI.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 51 |
| Navigation | Expo Router (file-based) + React Navigation Bottom Tabs |
| Language | TypeScript (.tsx) |
| Charts | Victory Native + react-native-svg |
| HTTP Client | Axios |
| Database | Firebase Firestore (Phase 3+) |
| AI / ML | TensorFlow Lite or Python Flask API (Phase 4+) |
| Notifications | Expo Notifications |
| Offline Cache | AsyncStorage |
| Firmware | Arduino (ESP32-S3) |

---

## 🏗️ Build Phases

This project is built in 5 sequential phases. See [`HydroSense_Build_Guide.docx`](./HydroSense_Build_Guide.docx) for the full step-by-step instructions.

| Phase | Title | What You Build | Output |
|:-----:|-------|---------------|--------|
| **1** | Frontend | All 5 screens with mock data using Expo Router + TypeScript | ✅ Working app skeleton |
| **2** | Hardware | ESP32-S3 firmware, sensor wiring (DHT11 × 3, pH, TDS, SD card) | ✅ Live sensor readings |
| **3** | Backend | Node.js REST API + Firebase Firestore real-time database | ✅ Cloud data sync |
| **4** | AI / ML | TensorFlow Lite plant classifier or Python Flask alternative | ✅ Growth stage detection |
| **5** | Integration | Connect all components, enable push notifications, build APK | ✅ Fully working system |

---

## 🌱 Hardware Setup (Phase 2)

### Components

- ESP32-S3 development board
- 3× DHT11 temperature & humidity sensors
- Analog pH sensor + signal conditioning module
- TDS (EC) sensor module
- MicroSD card module
- OV2640 Camera Module (ESP32-CAM variant)

### Wiring Reference

| Sensor | ESP32 Pin | Notes |
|--------|-----------|-------|
| DHT11 #1 | GPIO 4 | 10kΩ pull-up to 3.3V |
| DHT11 #2 | GPIO 5 | 10kΩ pull-up to 3.3V |
| DHT11 #3 | GPIO 18 | 10kΩ pull-up to 3.3V |
| pH Sensor | GPIO 34 (ADC1_CH6) | Voltage divider if >3.3V |
| TDS Sensor | GPIO 35 (ADC1_CH7) | Voltage divider if >3.3V |
| SD Card MOSI | GPIO 23 | SPI bus |
| SD Card MISO | GPIO 19 | SPI bus |
| SD Card CLK | GPIO 14 | SPI bus |
| SD Card CS | GPIO 15 | Chip select |

---

## 🌐 Backend API (Phase 3)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/readings` | Receive sensor data from ESP32 |
| `GET` | `/api/readings/latest` | Return most recent reading |
| `GET` | `/api/readings?limit=N` | Return last N readings |
| `GET` | `/api/readings/chart?var=temp` | Return chart data array |
| `POST` | `/api/classify` | Accept base64 image, return growth stage |
| `GET` | `/api/system/health` | Return ESP32 + sensor status |

### Switch from Mock → Live Data

In `src/utils/api.ts`, swap the mock returns:

```ts
// Phase 1 (mock):
return MOCK_READINGS;

// Phase 5 (live):
const res = await api.get('/readings/latest');
return res.data;
```

---

## 📊 Optimal Sensor Ranges

| Parameter | Seedling | Vegetative | Fruiting | Unit |
|-----------|:--------:|:----------:|:--------:|------|
| Temperature | 18–24 | 20–28 | 22–30 | °C |
| Humidity | 60–70 | 55–75 | 50–65 | % |
| pH Level | 5.5–6.5 | 5.8–7.0 | 6.0–6.8 | pH |
| TDS Nutrients | 200–400 | 800–1200 | 1000–1500 | ppm |
| Nitrogen (N) | 100 | 200 | 150 | ppm target |
| Phosphorus (P) | 50 | 60 | 100 | ppm target |
| Potassium (K) | 150 | 220 | 300 | ppm target |

---

## 📦 Key Dependencies

```json
"expo":                              "~51.0.0",
"expo-router":                       "~3.5.0",
"react-native":                      "0.74.0",
"@react-navigation/bottom-tabs":     "^6.5.20",
"victory-native":                    "^36.9.2",
"react-native-svg":                  "15.2.0",
"expo-camera":                       "~15.0.0",
"expo-image-picker":                 "~15.0.0",
"expo-notifications":                "~0.28.0",
"axios":                             "^1.7.2",
"@react-native-async-storage/async-storage": "1.23.1"
```

---

## 🏭 Building a Release APK

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Configure build
eas build:configure

# 4. Build Android APK (preview profile)
eas build --platform android --profile preview

# 5. For iOS (requires Apple Developer account)
eas build --platform ios
```


## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use this project for personal or educational purposes.

---

<p align="center">Built with 🌿 for smarter growing</p>
