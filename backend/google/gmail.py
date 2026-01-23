from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

def get_email_count():
    # Assume creds loaded from token or session
    creds = Credentials.from_authorized_user_file('token.json')
    service = build('gmail', 'v1', credentials=creds)
    results = service.users().messages().list(userId='me').execute()
    messages = results.get('messages', [])
    return len(messages)
