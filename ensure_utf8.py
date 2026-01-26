
import os

files = [
    r'c:\Users\PC\.gemini\antigravity\scratch\macc-cino\public\about.html',
    r'c:\Users\PC\.gemini\antigravity\scratch\macc-cino\public\contact.html',
    r'c:\Users\PC\.gemini\antigravity\scratch\macc-cino\public\index.html'
]

for file_path in files:
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Ensure it's valid UTF-8 by writing it back explicitly
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Verified and saved {os.path.basename(file_path)} as UTF-8")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
