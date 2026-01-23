from flask import Flask, jsonify, request
from flask_cors import CORS
import datetime
import random
import pandas as pd
import os
import pickle
from models import db
from models import User
from auth import auth_bp

# Existing Google API imports you already have
from google.gmail import get_email_count
from google.drive import get_drive_storage
from google.youtube import get_video_hours

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

app = Flask(__name__)
CORS(app)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)

def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)  # initialize db here

    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()

    return app

app = create_app()

SCOPES = [
    'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/youtube.readonly',
]

def get_google_service(api_name, api_version):
    """Authenticate and return a Google API service client."""
    creds = None
    token_path = "token.json"  # Changed to token.json as per your setup

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, SCOPES)
    else:
        if not os.path.exists("credentials.json"):  # Changed file name here
            print("⚠️ No credentials.json found — running in SIMULATION mode.")
            return None
        flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
        # creds = flow.run_local_server(port=0)
        creds = flow.run_local_server(
            port=8090,  # 0 means pick any available port automatically
            access_type='offline',
            prompt='consent'
        )

        with open(token_path, "w") as token_file:
            token_file.write(creds.to_json())

    try:
        service = build(api_name, api_version, credentials=creds)
        return service
    except Exception as e:
        print("⚠️ Google service creation failed:", e)
        return None

def enable_smart_email_scheduling():
    service = get_google_service("gmail", "v1")
    if service is None:
        return "[SIMULATION] Smart Email Scheduling simulated."

    results = service.users().messages().list(userId="me", maxResults=5).execute()
    messages = results.get("messages", [])
    count = 0
    for msg in messages:
        service.users().messages().modify(
            userId="me",
            id=msg["id"],
            body={"addLabelIds": ["Label_Important"], "removeLabelIds": []},
        ).execute()
        count += 1

    return f"✅ Smart Email Scheduling enabled. Labeled {count} recent messages as important."

def optimize_youtube_streaming():
    service = get_google_service("youtube", "v3")
    if service is None:
        return "[SIMULATION] YouTube optimization simulated."

    channels = service.channels().list(mine=True, part="snippet,statistics").execute()
    if not channels.get("items"):
        return "No YouTube channels found."
    channel_name = channels["items"][0]["snippet"]["title"]
    return f"🎥 Streaming optimization activated for channel: {channel_name}"

def archive_old_files():
    service = get_google_service("drive", "v3")
    if service is None:
        return "[SIMULATION] File archiving simulated."

    folders = service.files().list(
        q="mimeType='application/vnd.google-apps.folder' and name='Archive'",
        fields="files(id, name)"
    ).execute()

    if not folders["files"]:
        folder_metadata = {
            "name": "Archive",
            "mimeType": "application/vnd.google-apps.folder"
        }
        folder = service.files().create(body=folder_metadata, fields="id").execute()
        folder_id = folder["id"]
    else:
        folder_id = folders["files"][0]["id"]

    files = service.files().list(pageSize=5, fields="files(id, name)").execute().get("files", [])
    moved = 0
    for file in files:
        try:
            service.files().update(fileId=file["id"], addParents=folder_id, removeParents=None).execute()
            moved += 1
        except Exception:
            continue

    return f"📦 Archived {moved} recent files into 'Archive' folder."







@app.route("/execute_plan", methods=["POST"])
def execute_plan():
    data = request.json
    print("Received plan:", data)

    action = data.get("action")
    target = data.get("target")

    result = {"status": "pending", "info": "Processing..."}

    try:
        if action == "enable_feature":
            if target == "smart_email_scheduling":
                info = enable_smart_email_scheduling()
            elif target == "optimize_streaming":
                info = optimize_youtube_streaming()
            elif target == "archive_old_files":
                info = archive_old_files()
            else:
                info = f"Unknown feature: {target}"

            result["status"] = "done"
            result["info"] = info

        else:
            result["status"] = "unknown"
            result["info"] = "No valid action provided."

    except Exception as e:
        result["status"] = "error"
        result["info"] = str(e)

    return jsonify(result)



# --- In-memory storage for demo, replace with DB or session as needed ---
USER_SETTINGS = {
    "profile": {"firstName": "John", "lastName": "Doe", "email": "john.doe@example.com", "organization": "EcoScope"},
    "notifications": {"email": True, "carbonAlerts": True, "projectUpdates": True, "badges": True},
    "privacy": {"publicProfile": True, "dataSharing": True}
}

@app.route("/api/settings", methods=["GET"])
def get_settings():
    return jsonify(USER_SETTINGS)

@app.route("/api/settings/profile", methods=["POST"])
def update_profile():
    USER_SETTINGS["profile"] = request.json
    return jsonify({"success": True})

@app.route("/api/settings/notifications", methods=["POST"])
def update_notifications():
    USER_SETTINGS["notifications"] = request.json
    return jsonify({"success": True})

@app.route("/api/settings/privacy", methods=["POST"])
def update_privacy():
    USER_SETTINGS["privacy"] = request.json
    return jsonify({"success": True})



# --- Load dataset ---
CSV_FILE = "NCCR_Marine_Sample_500.csv"
df = pd.read_csv(CSV_FILE)

# Create unique Project_ID if not present
if "Project_ID" not in df.columns:
    df.insert(0, "Project_ID", range(1, len(df) + 1))

# Convert to list of dicts
records = df.to_dict(orient="records")

# Verification status: all existing projects VERIFIED initially
verification_status = {r["Project_ID"]: "Verified" for r in records}

@app.route("/")
def home():
    return jsonify({
        "message": "🌊 Blue Carbon / Marine Dataset API",
        "routes": {
            "/api/data": "Get all records (supports ?page & ?limit)",
            "/api/data/<id>": "Get record by ID",
            "/api/filter?column=Parameter&value=CO2": "Filter by column & value",
            "/api/columns": "List all columns available",
            "/api/verify/<int:project_id>": "POST to verify a project",
            "/api/add": "POST to add a new project"
        },
        "total_records": len(records)
    })

@app.route("/api/data", methods=["GET"])
def get_data():
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 20))
    start = (page - 1) * limit
    end = start + limit
    paginated = records[start:end]
    for rec in paginated:
        pid = rec["Project_ID"]
        rec["Verification_Status"] = verification_status.get(pid, "Pending")
        rec.setdefault("Status", "Pending")
    return jsonify({
        "page": page,
        "limit": limit,
        "total_records": len(records),
        "data": paginated
    })

@app.route("/api/data/<int:record_id>", methods=["GET"])
def get_record(record_id):
    record = next((r for r in records if r["Project_ID"] == record_id), None)
    if record:
        record["Verification_Status"] = verification_status.get(record_id, "Pending")
        record.setdefault("Status", "Pending")
        return jsonify(record)
    return jsonify({"error": "Record not found"}), 404

@app.route("/api/filter", methods=["GET"])
def filter_data():
    column = request.args.get("column")
    value = request.args.get("value")

    if not column or not value:
        return jsonify({"error": "Please provide both ?column and ?value"}), 400

    if column not in df.columns:
        return jsonify({"error": f"Column '{column}' not found"}), 404

    filtered = df[df[column].astype(str).str.contains(value, case=False, na=False)].to_dict(orient="records")
    for rec in filtered:
        pid = rec.get("Project_ID", None)
        if pid is not None:
            rec["Verification_Status"] = verification_status.get(pid, "Pending")
        else:
            rec["Verification_Status"] = "Pending"
        rec.setdefault("Status", "Pending")
    return jsonify({
        "count": len(filtered),
        "filtered_data": filtered[:50]
    })

@app.route("/api/columns", methods=["GET"])
def get_columns():
    return jsonify({
        "columns": list(df.columns)
    })

@app.route("/api/verify/<int:project_id>", methods=["POST"])
def verify_project(project_id):
    if project_id not in verification_status:
        return jsonify({"error": "Project not found"}), 404
    verification_status[project_id] = "Verified"
    return jsonify({"message": f"Project {project_id} has been verified successfully."})

# New: Add a project endpoint, starts as Pending verification
@app.route("/api/add", methods=["POST"])
def add_project():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # Basic validation: Must include Station_ID (or others as needed)
    required_fields = [
        "Station_ID", "Location", "Latitude", "Longitude", "Mangrove_Cover_ha",
        "Carbon_Sequestration_tCO2_per_ha_per_year", "pH", "Salinity_ppt",
        "Dissolved_Oxygen_mg_L", "Turbidity_NTU", "Biodiversity_Index",
        "Fish_Count", "Timestamp"
    ]
    missing = [f for f in required_fields if f not in data]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    # Generate new Project_ID
    new_id = max(verification_status.keys()) + 1 if verification_status else 1

    # Create new record dict
    new_record = {"Project_ID": new_id}
    for col in df.columns:
        if col in data :
            new_record[col] = data[col]
        else:
            # For any missing column (shouldn't happen due to validation), set None or default
            new_record[col] = None
    # Add to records and dataframe (optional persistence needed)
    records.append(new_record)
    verification_status[new_id] = "Pending"  # New project pending verification

    return jsonify({
        "message": "New project added, pending verification by admin.",
        "project": new_record
    }), 201








# --- Category Breakdown Pie Data (for chart/focus areas) ---
@app.route('/api/category/pie', methods=['GET'])
def get_category_data():
    data = [
        {'name': 'Email', 'value': get_email_count()},
        {'name': 'Online Storage', 'value': get_drive_storage()},
        {'name': 'Video Streaming', 'value': get_video_hours()},
    ]
    return jsonify(data)

# --- Weekly Total for the Past 7 Days ---
@app.route('/api/weekly/total', methods=['GET'])
def get_weekly_totals():
    email_val = get_email_count()
    storage_val = get_drive_storage()
    video_val = get_video_hours()
    today = datetime.date.today()
    weekly_data = []
    for i in range(7):
        day_date = today - datetime.timedelta(days=6 - i)
        day_label = day_date.strftime('%a')
        daily_email = max(0, int(email_val * random.uniform(0.85, 1.15)))
        daily_storage = max(0, int(storage_val * random.uniform(0.85, 1.15)))
        daily_video = max(0, int(video_val * random.uniform(0.85, 1.15)))
        total = daily_email + daily_storage + daily_video
        weekly_data.append({
            "day": day_label,
            "value": total
        })
    return jsonify(weekly_data)

# --- Daily Breakdown (for quick stats block/chart) ---
@app.route('/api/daily_breakdown', methods=['GET'])
def get_daily_breakdown():
    email_count = get_email_count()
    storage_gb = get_drive_storage()
    video_hours = get_video_hours()
    return jsonify({
        "emails_sent": email_count,
        "cloud_storage": round(storage_gb, 1),
        "video_hours": round(video_hours, 1)
    })

# --- Total CO₂ for Today (example: sum, can replace with your conversion logic) ---
@app.route('/api/total_co2', methods=['GET'])
def get_total_co2():
    email_count = get_email_count()
    storage_gb = get_drive_storage()
    video_hours = get_video_hours()
    # Replace with your actual carbon calculation formula if desired
    total = email_count + storage_gb + video_hours
    return jsonify({ "total": round(total) })

# --- Carbon Trend for Chart (e.g., for CarbonChart) ---
@app.route('/api/carbonchart', methods=['GET'])
def get_carbon_chart_data():
    # Ideally this comes from your database/historical actuals,
    # but for demonstration, we'll just use your static example with random jitter
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    data = []
    base_digital = [3.2, 3.1, 2.9, 2.7, 2.5, 2.4]
    base_offset = [1.8, 2.0, 2.2, 2.5, 2.8, 3.0]
    for i in range(6):
        data.append({
            "month": months[i],
            "digital": round(base_digital[i] * random.uniform(0.9, 1.1), 2),
            "offset": round(base_offset[i] * random.uniform(0.9, 1.1), 2)
        })
    return jsonify(data)



if __name__ == '__main__':
    app.run(port=5000, debug=True)