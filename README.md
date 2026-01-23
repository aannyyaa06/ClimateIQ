# 🌿 Carbogreen

**Carbogreen** is a **"Carbon Footprint & Marine Conservation Dashboard"**. It connects your digital life with the physical world by tracking your digital carbon footprint (emails, storage, streaming) and connecting you with "Blue Carbon" marine conservation projects.

---

## 🌟 Features

*   **Digital Carbon Tracking**: 
    *   Estimates CO₂ impact from **Gmail** (email count), **Google Drive** (storage size), and **YouTube** (streaming hours).
*   **Actionable Automation**: 
    *   **Smart Email Scheduling**: Review and organize emails to reduce clutter.
    *   **File Archiving**: Automatically move old files to an "Archive" folder in Drive to manage storage.
*   **Blue Carbon Marketplace**: 
    *   Explore a database of marine conservation projects (Mangroves, Blue Carbon).
    *   View detailed metrics like **Carbon Sequestration**, **Biodiversity Index**, and **Water Quality** from coastal stations across India.
*   **Interactive Dashboard**: Visualizes your daily vs. weekly carbon trends using beautiful charts.

---

## 🛠️ Technology Stack

### Frontend (The Face)
*   **React** (built with **Vite**) for a fast, responsive UI.
*   **Tailwind CSS** for modern styling.
*   **Shadcn UI** for professional, accessible components.

### Backend (The Brain)
*   **Python Flask** for the API server.
*   **Pandas** for processing marine datasets (`CSV` analysis).
*   **Google APIs** (Gmail, Drive, YouTube) for real-time user data.

---

## 🚀 Getting Started

Follow these steps to run Carbogreen locally.

### Prerequisites
*   **Node.js** (for frontend)
*   **Python** (for backend)
*   **Google Cloud Credentials**: You need a `credentials.json` file for Google API access (place it in the `backend/` folder).

### 1. Backend Setup
The backend runs the logic and connects to Google Services.

```bash
cd backend
# Create a virtual environment (optional but recommended)
python -m venv venv
# Windows: venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```
*The backend runs on `http://localhost:5000`.*

### 2. Frontend Setup
The frontend displays the dashboard.

```bash
cd frontend
# Install dependencies
npm install

# Start the dev server
npm run dev
```
*The frontend runs on `http://localhost:8080` (or similar).*

---

## 📄 License

This project is licensed under the **MIT License** - see the `LICENSE` file for details.

---

**Copyright (c) 2026 aannyyaa06**
