# Project Explanation: Carbogreen

## 🌟 Simple Project Overview
Imagine this application as a **"Carbon Footprint & Marine Conservation Dashboard"**. It helps users track two things:
1.  **Digital "Waste"**: How much CO₂ you are generating by sending emails, storing files, and streaming videos (using Google services).
2.  **Nature's Solution**: A database of "Blue Carbon" projects—specifically marine ecosystems like mangroves that suck up carbon dioxide from the air.

It connects your digital life (Google) with the physical world (Marine conservation).

---

## 🎨 Frontend (The Face of the App)
The **Frontend** is what you see in your browser. It's built using **React**, which is like a set of building blocks for websites.

### Key Tools Used:
-   **Vite**: A tool that makes the website start up very fast.
-   **Tailwind CSS**: A styling tool that makes it easy to make the site look beautiful and modern (like the buttons, colors, and layouts).
-   **Shadcn UI**: A collection of pre-made, professional-looking components (like popups, forms, and cards) so the developer doesn't have to build them from scratch.

### Important Pages (in `frontend/src/pages`):
1.  **`Login.tsx` / `Signup.tsx`**: The entrance doors. You need to sign up or log in to see the data.
2.  **`Index.tsx` (Dashboard)**: The main control center. It likely shows charts and summaries of your carbon impact.
3.  **`Projects.tsx`**: A list of marine conservation projects. Think of it like a shopping catalog, but for saving the planet.
4.  **`Activity.tsx`**: Shows your personal digital habits (e.g., "You sent 500 emails this week!").
5.  **`Marketplace.tsx`**: A place where you might "buy" stats or support projects (likely credits).

### How it works:
The frontend is like a waiter in a restaurant. It takes your requests (clicks) and sends them to the kitchen (Backend) to get the food (Data).

---

## 🧠 Backend (The Brain of the App)
The **Backend** is the invisible engine running behind the scenes. It's built using **Python** and a framework called **Flask**.

### Key Files (in `backend/`):

#### 1. `app.py` (The Commander)
This is the main file that runs the server. It listens for orders from the frontend.
-   **The Marine Database**: It reads a file called `NCCR_Marine_Sample_500.csv`. This file is like a giant Excel sheet filled with data about water quality, fish counts, and mangroves.
-   **The Digital Tracker**: It connects to **Google APIs** (Gmail, Drive, YouTube) to count your emails and files.
    -   *Example*: It counts how many emails you have to estimate your "digital carbon footprint."
-   **The "Agents"**: It has special functions to "clean up" your digital mess:
    -   `enable_smart_email_scheduling`: Organizes your Gmail.
    -   `archive_old_files`: Moves old files to an "Archive" folder in Google Drive.

#### 2. `auth.py` (The Bouncer)
This handles "Google Login". It makes sure users are who they say they are before letting them access the data or Google features.

#### 3. `models.py` (The Blueprint)
This defines what a "User" looks like in the database (e.g., a User has an ID, a name, an email).

#### 4. `requirements.txt` (The Ingredients List)
A list of all the Python tools the backend needs to run (like `flask`, `pandas`, `google-api-python-client`).

---

## 🔄 How They Talk to Each Other
1.  **You** click "Show me Projects" on the website.
2.  **Frontend** sends a message to the **Backend** (`GET /api/data`).
3.  **Backend** reads the CSV file, filters the list of projects, and sends it back in JSON format (a language computers speak).
4.  **Frontend** receives the list and draws beautiful cards on your screen.

## ✨ Unique Feature: Automation
This app doesn't just *show* you problems; it tries to *fix* them.
-   If you have too many old files, you can click a button, and the Backend will actually go into your Google Drive and move them to an archive folder to "save space" (and theoretically energy).
