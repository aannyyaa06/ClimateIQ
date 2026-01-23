from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

def get_video_hours():
    creds = Credentials.from_authorized_user_file('token.json')
    service = build('youtube', 'v3', credentials=creds)
    # Example: get watch history if available or user's recent activity (simplified)
    # Usually needs YouTube analytics API, this is illustrative
    # Return static number or fetch real usage as per API limits
    return 3.5
