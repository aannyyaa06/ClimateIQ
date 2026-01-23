from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

def get_drive_storage():
    creds = Credentials.from_authorized_user_file('token.json')
    service = build('drive', 'v3', credentials=creds)
    about = service.about().get(fields="storageQuota").execute()
    used_gb = int(about['storageQuota']['usage']) / (1024**3)
    return round(used_gb, 2)
