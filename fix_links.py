
import os

file_path = r'c:\Users\PC\.gemini\antigravity\scratch\macc-cino\public\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_content = content.replace('href="#hakkimizda"', 'href="about"')
new_content = new_content.replace('href="#iletisim"', 'href="contact"')

# Remove the sections if they are duplicate?
# The user didn't explicitly ask to remove the sections, just that links were broken.
# However, if we link to external pages, having on-page sections with same IDs might be confusing but harmless.
# I'll leave them for now unless requested.

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Successfully updated links in index.html")
