# Translation Glossary & Rules (TR → DE / EN)

This is a premium coffee-machine / barista-service brand site. Translate marketing
copy naturally and fluently (not word-for-word). Keep a confident, professional B2B tone.

## CRITICAL key rules
- Output a JSON object. Each KEY must be the **byte-exact** Turkish source string
  (copy it verbatim from `strings.tr.json`, including any odd/garbled characters,
  leading/trailing spaces, commas, quotes, and `|`). Do NOT retype keys from memory.
- The VALUE is the clean translation. If the source key has garbled encoding
  (e.g. `â¨`, `KÃRLILIÄINIZI`, `Benzin stasyonu`, `Gastronomi çin`), translate by
  intended MEANING and write clean text (drop the garbage, fix the obvious typo).
- Many keys are sentence FRAGMENTS (start/end mid-sentence, e.g. `, Daha Fazla`,
  `olmak.`, `sunuyoruz.`). Preserve the fragment nature and any leading/trailing
  punctuation/space so it still flows when concatenated.
- Preserve CASING intent: an ALL-CAPS source → ALL-CAPS translation.
- Preserve `|` title separators and the spacing around them.
- Pure text only — never add or remove HTML.

## Do NOT translate (keep verbatim)
- Brand: `MAC&CINO`, `MACC&CINO`, `Macc`, `Cino`, `Barista Company`, `MACC&CINO BARISTA COMPANY`
- Taglines kept in English already: `Better Coffee.`, `Better Business.`,
  `COFFEE`, `COFFEE SOLUTIONS.`, `Service & Support`, `Team Working`, `Loading`,
  `Premium Coffee at Gas Station`, `Fitness Coffee Experience`, `Hotel Luxury Coffee`,
  `Grand Hotel`, `Power Gym`, `Tech Plaza`, `Enterprise Ofis`→keep `Enterprise` brandy.
- Drink / product names: `Espresso`, `Cappuccino`, `Latte Macchiato`, `Flat White`,
  `Cafe Crema`, `Crema`, `Chai Latte`, `Matcha`, `Ice Cappuccino`, `Iced Coffee`,
  `Cold Brew`, `Frappe`, `Latte`, `Salty Caramel Kiss`, `Red Berry`, `Toffee Banana`,
  `Coffee Shop`, `Coffee-House`, `To Go`, `Key Account`, `Vending`.
- Social / nav: `Instagram`, `Facebook`, `LinkedIn`, `WhatsApp`, `Shop`.
- Numbers, `7/24` (keep the token `7/24` as-is in both DE and EN), `%100`, `1M+`,
  `350 TL`, `TL`, dates `2026`, certifications `ISO`, `IFS`, `EILES`.
- Address parts: `Kavaklidere Mah.`, `Büklüm Sk. 12/B`, `Ankara/Cankaya`.

## Company name
- `MoccaTec Kahve Sistemleri` → DE: `MoccaTec Kaffeesysteme` · EN: `MoccaTec Coffee Systems`
  (keep `MoccaTec`; translate the `Kahve Sistemleri` descriptor). Apply consistently,
  including inside page-title strings ending in `| MoccaTec Kahve Sistemleri`.

## Core term glossary (TR → DE → EN)
- Kahve → Kaffee → Coffee
- Kahve Makineleri → Kaffeemaschinen → Coffee Machines
- Kahve Makinesi → Kaffeemaschine → Coffee Machine
- (Tam) Otomatik kahve makinesi → (Voll)automatische Kaffeemaschine → (Fully) automatic coffee machine
- Espresso makinesi → Espressomaschine → Espresso machine
- Barista kalitesinde / Barista Kalitesi → in Barista-Qualität / Barista-Qualität → Barista quality
- Süt Köpüğü → Milchschaum → Milk foam
- Kahve Çekirdekleri / Çekirdek → Kaffeebohnen / Bohne → Coffee beans / Bean
- Kavurma / Kavrulmuş → Röstung / geröstet → Roasting / roasted
- Teknik Servis → Technischer Service → Technical Service
- Bakım → Wartung → Maintenance
- Onarım / Arıza → Reparatur / Störung → Repair / Fault
- Kiralama / Kiralayın → Miete / Mieten → Rental / Rent (lease)
- Satın alma → Kauf → Purchase
- Sektör → Branche → Sector
- Gastronomi → Gastronomie → Gastronomy
- Ofis → Büro → Office
- Otel / Pansiyon → Hotel / Pension → Hotel / Guesthouse
- Fırın / Pastane → Bäckerei / Konditorei → Bakery / Pastry
- Fitness / Sağlık → Fitness / Gesundheit → Fitness / Health
- Spor Salonu → Fitnessstudio → Gym
- Benzin/Akaryakıt İstasyonu → Tankstelle → Gas Station
- Mağaza Zincirleri / Zincir İşletmeler → Filialketten → Store Chains
- Şube → Filiale → Branch
- Hakkımızda → Über uns → About Us
- İletişim → Kontakt → Contact
- Kariyer → Karriere → Careers
- Konseptimiz → Unser Konzept → Our Concept
- Trend İçecekler → Trendgetränke → Trend Beverages
- Kahve Spesiyalleri / Spesiyaliteleri → Kaffeespezialitäten → Coffee Specialties
- Satış / Satışlar → Verkauf / Umsatz → Sales / Revenue
- Müşteri → Kunde → Customer
- Misafir → Gast → Guest
- Çalışan → Mitarbeiter → Employee
- İşletme → Betrieb / Unternehmen → Business
- Danışmanlık → Beratung → Consulting
- Teklif Al / Bilgi Talep Et → Angebot anfordern / Infos anfordern → Request a Quote / Request Info
- Hemen İletişime Geçin → Jetzt Kontakt aufnehmen → Get in Touch Now
- Detaylı Bilgi → Mehr erfahren → Learn More
- Keşfedin → Entdecken → Discover
- Gönder / Mesajı Gönder → Senden / Nachricht senden → Send / Send Message
- Adınız Soyadınız → Ihr Name → Your Name
- E-posta Adresiniz → Ihre E-Mail-Adresse → Your Email
- Telefon Numaranız → Ihre Telefonnummer → Your Phone Number
- Mesajınız → Ihre Nachricht → Your Message
- Hangi Sektördesiniz? → In welcher Branche sind Sie tätig? → What is your sector?
- Tam Otomatik → Vollautomatisch → Fully Automatic
- Tek Tuşla → Auf Knopfdruck → One-Touch
- Self-servis → Selbstbedienung → Self-service

## Form field asterisks
- A trailing ` *` marks a required field — keep the ` *` in the translation.
