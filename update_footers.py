import os
import re

footer_html = """    <!-- Footer -->
    <footer id="iletisim" class="footer">
        <div class="container footer-content">
            <div class="footer-brand">
                <h2>MAC&Cino</h2>
                <p>Better Coffee. Better Business.</p>
                <div class="social-links-footer">
                    <a href="#" style="color: #fff; margin-right: 15px;"><i class="fab fa-instagram"></i></a>
                    <a href="#" style="color: #fff; margin-right: 15px;"><i class="fab fa-facebook"></i></a>
                    <a href="#" style="color: #fff;"><i class="fab fa-linkedin"></i></a>
                </div>
            </div>
            <div class="footer-info">
                <h3>Teknik Servis</h3>
                <p><i class="fas fa-phone-alt"></i> 0850 123 45 67</p>
                <p><i class="fas fa-envelope"></i> servis@mac-cino.com</p>
                <p><i class="fas fa-map-marker-alt"></i> İstanbul, Türkiye</p>
            </div>
            <div class="footer-links">
                <h3>Kurumsal</h3>
                <a href="concept.html">Konseptimiz</a>
                <a href="service.html">Teknik Servis</a>
                <a href="careers.html">Kariyer</a>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Mac&Cino Barista Company. Tüm hakları saklıdır.</p>
        </div>
    </footer>"""

directory = r'c:\Users\PC\.gemini\antigravity\scratch\cupcino_rebuild'

for filename in os.listdir(directory):
    if filename.endswith('.html'):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Look for <!-- Footer --> ... </footer> or <footer ... </footer>
        # Using a safer approach with regex
        pattern = re.compile(r'<!-- Footer -->\s*<footer.*?</footer>', re.DOTALL)
        if pattern.search(content):
            new_content = pattern.sub(footer_html, content)
        else:
            pattern2 = re.compile(r'<footer.*?</footer>', re.DOTALL)
            new_content = pattern2.sub(footer_html, content)
        
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filename}")
        else:
            print(f"Skipped {filename} (no footer match)")
