
import os
import re

def fix_html_files(directory):
    html_files = [f for f in os.listdir(directory) if f.endswith('.html')]
    
    # Common Turkish characters corruption patterns found in ISO-8859-9 / Windows-1254 seen as UTF-8
    # However, since the user sees '', it means the file is LIKELY encoded in ISO-8859-9 
    # and the browser/editor is trying to read it as UTF-8.
    
    for filename in html_files:
        filepath = os.path.join(directory, filename)
        print(f"Processing {filename}...")
        
        content = None
        # Try reading as Windows-1254 (Turkish)
        try:
            with open(filepath, 'rb') as f:
                raw_data = f.read()
            
            # Try to decode from Turkish encoding
            content = raw_data.decode('iso-8859-9')
        except Exception as e:
            print(f"Error reading {filename} with iso-8859-9: {e}")
            continue

        if content:
            # 1. Add/Update Meta Charset
            # check if <meta charset="UTF-8"> exists
            if '<meta charset="UTF-8">' not in content:
                # Insert right after <head>
                content = re.sub(r'(<head\s*>)', r'\1\n    <meta charset="UTF-8">', content, flags=re.IGNORECASE)
            
            # 2. Write back as UTF-8
            try:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Successfully updated {filename}")
            except Exception as e:
                print(f"Error writing {filename} as utf-8: {e}")

if __name__ == "__main__":
    public_dir = r'C:\Users\PC\.gemini\antigravity\scratch\macc-cino\public'
    fix_html_files(public_dir)
