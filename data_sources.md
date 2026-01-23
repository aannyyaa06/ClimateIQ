# Data Sources

Here are the data sources used in the CarbonScopeHackx solution:

### 1. NCCR Marine Dataset (Sample)
*   **Name of Dataset**: `NCCR_Marine_Sample_500.csv`
*   **Nature of Data**: Structured tabular data (CSV).
    *   It contains **500 records** of marine environmental parameters (e.g., **Mangrove Cover, Carbon Sequestration, pH, Salinity, Biodiversity Index**) collected from coastal stations across India (Chennai, Mumbai, Kochi, etc.).
    *   The regularity of timestamps (15-minute intervals) and the specific naming convention (`NCCR001` - `NCCR500`) suggest this is a **synthetic or curated sample dataset** designed for demonstration purposes, modeled after real-world coastal research parameters.
*   **Licensing/Reuse**: Proprietary/Demo use. Used locally within the application as a static database.

### 2. Google User Data (Live Personal Data)
*   **Name of Portals**: Google Cloud Platform APIs (Gmail API, Google Drive API, YouTube Data API).
*   **Nature of Data**: **Real-time, private user data**.
    *   The application fetches live metrics from the user's authenticated account:
        *   **Gmail**: Number of messages (used to estimate digital carbon footprint).
        *   **Drive**: Storage usage (GB) and file metadata.
        *   **YouTube**: Channel statistics and video hours.
*   **Licensing/Reuse**: Subject to **Google API Terms of Service**. Data is accessed only with explicit user consent (OAuth 2.0) and is not stored permanently or shared publicly.

### 3. Application Generated Data (Synthetic)
*   **Name of Dataset**: Internal Mock Data.
*   **Nature of Data**: **Synthetic/Calculated**.
    *   The backend (`app.py`) generates randomized weekly trends and "Carbon Chart" data points to visualize progress on the dashboard where historical data is missing.
*   **Licensing/Reuse**: Generated dynamically by the application logic (Open Source / MIT License as part of the codebase).
