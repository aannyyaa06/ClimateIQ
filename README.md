<div align="center">

# 🌿 DigiBin

### Carbon Footprint & Marine Conservation Dashboard

**Digital Carbon Tracking · Blue Carbon Marketplace · Google API Integration**

[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Backend-Flask-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.x-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Overview

**DigiBin** bridges your digital life with the physical world. Most people don't realize that emails, cloud storage, and streaming all leave a carbon footprint — this dashboard makes that visible, gives you tools to reduce it, and connects you with real marine conservation projects that sequester carbon from the ocean.

It plugs into your Google account (Gmail, Drive, YouTube) to pull real usage data, estimates your CO₂ impact, and lets you take direct action — whether that's cleaning up old files, scheduling emails more efficiently, or exploring Blue Carbon conservation projects across coastal India.

---

## Features

### 🌍 Digital Carbon Tracking
Estimates your personal CO₂ impact from three sources:
- **Gmail** — based on email count and storage
- **Google Drive** — based on total storage size
- **YouTube** — based on streaming hours

### ⚡ Actionable Automation
- **Smart Email Scheduling** — review and organize emails to cut down digital clutter
- **File Archiving** — automatically moves old Drive files into an "Archive" folder to manage storage footprint

### 🌊 Blue Carbon Marketplace
- Browse a curated database of real marine conservation projects (Mangroves, Blue Carbon initiatives)
- View live metrics per coastal station across India:
  - Carbon Sequestration rates
  - Biodiversity Index
  - Water Quality scores

### 📊 Interactive Dashboard
Visualizes your daily vs. weekly carbon trends with clean, readable charts so you can actually see your impact over time.

---

## Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React + Vite | Fast, responsive UI framework |
| Tailwind CSS | Utility-first modern styling |
| Shadcn UI | Accessible, professional components |

### Backend
| Technology | Role |
|---|---|
| Python Flask | API server |
| Pandas | Marine dataset processing (CSV analysis) |
| Google APIs | Real-time Gmail, Drive, and YouTube data |

---

## Project Structure

```
carbogreen/
│
├── backend/
│   ├── app.py               # Flask API server
│   ├── credentials.json     # Google API credentials (not committed)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** — for the frontend
- **Python 3.x** — for the backend
- **Google Cloud Credentials** — a `credentials.json` file with access to Gmail, Drive, and YouTube APIs

> Get your credentials from [Google Cloud Console](https://console.cloud.google.com/). Place the downloaded `credentials.json` inside the `backend/` folder.

---

### 1. Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

Backend runs at `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at `http://localhost:8080`

---

### 3. Connect Your Google Account

On first run, you'll be prompted to authorize Carbogreen to access your Gmail, Drive, and YouTube data. This is handled via OAuth — your credentials are never stored on any server.

---

## How It Works

```
Google Account (Gmail / Drive / YouTube)
           │
           ▼
    Flask Backend (app.py)
    ├── Pulls real usage data via Google APIs
    ├── Estimates CO₂ from usage metrics
    └── Serves marine project data from CSV (via Pandas)
           │
           ▼
    React Frontend
    ├── Displays carbon footprint dashboard
    ├── Shows daily vs. weekly trend charts
    └── Blue Carbon Marketplace (browse + filter projects)
```

---

## License

MIT — free to use, modify, and distribute. See [LICENSE](LICENSE) for details.

---

<div align="center">

**Copyright © 2026 aannyyaa06**

*Your digital habits have a footprint. Make it count for something.*

</div>
