
file_path = r'c:\Users\PC\.gemini\antigravity\scratch\cupcino_rebuild\index.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Satır 361 ile 395 arasını sil (0-indexed olduğu için 360'tan 395'e kadar)
# Kullanıcı 1-indexed görüyor.
# Silinecek aralık: index 360 (line 361) to index 394 (line 395) inclusive.
# Python slice: start:end (end is exclusive). So 360:395.

new_lines = lines[:360] + lines[395:] 

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Satırlar silindi.")
