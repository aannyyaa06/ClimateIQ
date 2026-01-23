from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly',  # allows Drive metadata and storage usage read
]

flow = InstalledAppFlow.from_client_secrets_file('credentials.json', SCOPES)
creds = flow.run_local_server(
    port=8080,
    access_type='offline',
    prompt='consent'  # forces new consent screen with added scopes
)

with open('token.json', 'w') as token_file:
    token_file.write(creds.to_json())

print("Authentication successful. Credentials saved to token.json")

