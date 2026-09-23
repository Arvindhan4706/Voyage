const fs = require('fs');
const path = require('path');

const languages = {
  "en": { name: "English", strings: ["HOME", "DESTINATIONS", "EXPERIENCES", "The Art of Travel", "Curated Elegance", "Discover breathtaking destinations and bespoke experiences.", "Where would you like to go?", "Discover", "Curated For You", "Explore Experiences", "Handpicked Locales", "Trending Destinations", "Explore All", "From", "AI Trip Planner", "Design Your Perfect Journey", "Generate Itinerary"] },
  "es": { name: "Español", strings: ["INICIO", "DESTINOS", "EXPERIENCIAS", "El Arte de Viajar", "Elegancia Curada", "Descubra destinos impresionantes.", "¿A dónde le gustaría ir?", "Descubrir", "Curado Para Ti", "Explorar Experiencias", "Lugares Seleccionados", "Destinos de Tendencia", "Explorar Todo", "Desde", "Planificador IA", "Diseñe su Viaje", "Generar Itinerario"] },
  "fr": { name: "Français", strings: ["ACCUEIL", "DESTINATIONS", "EXPÉRIENCES", "L'Art du Voyage", "Élégance Soignée", "Découvrez des destinations.", "Où aimeriez-vous aller?", "Découvrir", "Conçu Pour Vous", "Explorer les Expériences", "Lieux Sélectionnés", "Destinations Tendances", "Tout Explorer", "À partir de", "Planificateur IA", "Concevez votre Voyage", "Générer l'Itinéraire"] },
  "de": { name: "Deutsch", strings: ["STARTSEITE", "REISEZIELE", "ERLEBNISSE", "Die Kunst des Reisens", "Kuratierte Eleganz", "Entdecken Sie atemberaubende Reiseziele.", "Wohin möchten Sie reisen?", "Entdecken", "Für Sie Kuratiert", "Erlebnisse Entdecken", "Handverlesene Orte", "Trend-Reiseziele", "Alles Entdecken", "Ab", "KI-Planer", "Gestalten Sie Ihre Reise", "Route Erstellen"] },
  "hi": { name: "हिन्दी", strings: ["मुख्य पृष्ठ", "गंतव्य", "अनुभव", "यात्रा की कला", "क्यूरेटेड लालित्य", "लुभावने गंतव्यों की खोज करें।", "आप कहाँ जाना चाहेंगे?", "खोजें", "आपके लिए", "अनुभव देखें", "चुनिंदा स्थान", "ट्रेंडिंग गंतव्य", "सभी देखें", "शुरू", "AI योजनाकार", "अपनी यात्रा डिजाइन करें", "जनरेट करें"] },
  "zh": { name: "中文", strings: ["首页", "目的地", "体验", "旅行的艺术", "精心策划的优雅", "探索令人惊叹的目的地。", "您想去哪里？", "发现", "为您精选", "探索体验", "精选地点", "热门目的地", "探索全部", "起价", "AI行程规划", "设计您的完美旅程", "生成行程"] },
  "ja": { name: "日本語", strings: ["ホーム", "目的地", "体験", "旅行の芸術", "厳選された優雅さ", "息をのむような目的地を発見。", "どこに行きたいですか？", "発見", "あなたのために厳選", "体験を探索", "厳選された場所", "人気の目的地", "すべて探索", "から", "AIトリッププランナー", "完璧な旅をデザイン", "旅程を作成"] },
  "pt": { name: "Português", strings: ["INÍCIO", "DESTINOS", "EXPERIÊNCIAS", "A Arte de Viajar", "Elegância Curada", "Descubra destinos de tirar o fôlego.", "Para onde você gostaria de ir?", "Descobrir", "Curadoria Para Você", "Explorar Experiências", "Locais Selecionados", "Destinos em Alta", "Explorar Tudo", "A partir de", "Planejador IA", "Projete sua Viagem", "Gerar Itinerário"] },
  "ru": { name: "Русский", strings: ["ГЛАВНАЯ", "НАПРАВЛЕНИЯ", "ВПЕЧАТЛЕНИЯ", "Искусство путешествий", "Кураторская элегантность", "Откройте для себя потрясающие места.", "Куда бы вы хотели отправиться?", "Открыть", "Специально для вас", "Исследовать впечатления", "Отобранные места", "Популярные направления", "Смотреть все", "От", "ИИ-планировщик", "Создайте свой маршрут", "Сгенерировать"] },
  "ar": { name: "العربية", strings: ["الرئيسية", "الوجهات", "تجارب", "فن السفر", "أناقة منتقاة", "اكتشف وجهات مذهلة.", "إلى أين تود الذهاب؟", "اكتشف", "منتقى لك", "استكشاف التجارب", "أماكن مختارة", "الوجهات الرائجة", "استكشاف الكل", "من", "مخطط الذكاء الاصطناعي", "صمم رحلتك المثالية", "إنشاء مسار الرحلة"] },
  "it": { name: "Italiano", strings: ["HOME", "DESTINAZIONI", "ESPERIENZE", "L'Arte del Viaggio", "Eleganza Curata", "Scopri destinazioni mozzafiato.", "Dove vorresti andare?", "Scopri", "Curato Per Te", "Esplora Esperienze", "Luoghi Selezionati", "Destinazioni di Tendenza", "Esplora Tutto", "Da", "Pianificatore IA", "Disegna il tuo Viaggio", "Genera Itinerario"] },
  "ko": { name: "한국어", strings: ["홈", "목적지", "경험", "여행의 예술", "큐레이션된 우아함", "숨막히는 목적지를 발견하세요.", "어디로 가고 싶으신가요?", "발견하다", "당신을 위한 큐레이션", "경험 탐색", "엄선된 장소", "인기 목적지", "모두 탐색", "부터", "AI 여행 플래너", "완벽한 여정 디자인", "일정 생성"] },
  "nl": { name: "Nederlands", strings: ["HOME", "BESTEMMINGEN", "ERVARINGEN", "De Kunst van het Reizen", "Gecureerde Elegantie", "Ontdek adembenemende bestemmingen.", "Waar zou je heen willen?", "Ontdekken", "Voor Jou Gecureerd", "Ontdek Ervaringen", "Geselecteerde Locaties", "Populaire Bestemmingen", "Alles Ontdekken", "Vanaf", "AI Reisplanner", "Ontwerp je Reis", "Route Maken"] },
  "tr": { name: "Türkçe", strings: ["ANA SAYFA", "DESTİNASYONLAR", "DENEYİMLER", "Seyahat Sanatı", "Özenle Seçilmiş Zarafet", "Nefes kesici destinasyonları keşfedin.", "Nereye gitmek istersiniz?", "Keşfet", "Sizin İçin Seçildi", "Deneyimleri Keşfedin", "Seçilmiş Mekanlar", "Trend Destinasyonlar", "Tümünü Keşfet", "İtibaren", "Yapay Zeka Planlayıcı", "Mükemmel Yolculuğunuzu Tasarlayın", "Rota Oluştur"] },
  "pl": { name: "Polski", strings: ["STRONA GŁÓWNA", "MIEJSCA DOCELOWE", "DOŚWIADCZENIA", "Sztuka Podróżowania", "Wyselekcjonowana Elegancja", "Odkryj zapierające dech w piersiach miejsca.", "Gdzie chciałbyś pojechać?", "Odkryj", "Stworzone dla Ciebie", "Odkryj Doświadczenia", "Wybrane Miejsca", "Popularne Kierunki", "Odkryj Wszystko", "Od", "Planer AI", "Zaprojektuj swoją Podróż", "Generuj Plan"] },
  "sv": { name: "Svenska", strings: ["HEM", "DESTINATIONER", "UPPLEVELSER", "Konsten att resa", "Utvald elegans", "Upptäck fantastiska destinationer.", "Vart vill du åka?", "Upptäck", "Utvalt för dig", "Utforska upplevelser", "Handplockade platser", "Trendiga destinationer", "Utforska alla", "Från", "AI Reseplanerare", "Designa din perfekta resa", "Skapa resplan"] },
  "da": { name: "Dansk", strings: ["HJEM", "DESTINATIONER", "OPLEVELSER", "Rejsekunsten", "Udvalgt elegance", "Oplev fantastiske destinationer.", "Hvor vil du gerne hen?", "Opdag", "Udvalgt til dig", "Udforsk oplevelser", "Håndplukkede steder", "Populære destinationer", "Udforsk alle", "Fra", "AI Rejseplanlægger", "Design din perfekte rejse", "Generer rejseplan"] },
  "fi": { name: "Suomi", strings: ["KOTI", "KOHTEET", "KOKEMUKSET", "Matkustamisen taide", "Valikoitu eleganssi", "Löydä henkeäsalpaavia kohteita.", "Minne haluaisit mennä?", "Löydä", "Sinulle valittu", "Tutki kokemuksia", "Käsin poimitut paikat", "Suositut kohteet", "Tutki kaikki", "Alkaen", "AI-matkasuunnittelija", "Suunnittele täydellinen matkasi", "Luo matkasuunnitelma"] },
  "no": { name: "Norsk", strings: ["HJEM", "DESTINASJONER", "OPPLEVELSER", "Reisekunsten", "Utvalgt eleganse", "Oppdag fantastiske destinasjoner.", "Hvor vil du reise?", "Oppdag", "Utvalgt for deg", "Utforsk opplevelser", "Håndplukkede steder", "Populære destinasjoner", "Utforsk alt", "Fra", "AI Reiseplanlegger", "Design din perfekte reise", "Generer reiserute"] },
  "el": { name: "Ελληνικά", strings: ["ΑΡΧΙΚΗ", "ΠΡΟΟΡΙΣΜΟΙ", "ΕΜΠΕΙΡΙΕΣ", "Η Τέχνη του Ταξιδιού", "Επιλεγμένη Κομψότητα", "Ανακαλύψτε μαγευτικούς προορισμούς.", "Πού θα θέλατε να πάτε;", "Ανακαλύψτε", "Επιλεγμένα για Εσάς", "Εξερευνήστε Εμπειρίες", "Διαλεγμένα Μέρη", "Δημοφιλείς Προορισμοί", "Εξερευνήστε Όλα", "Από", "Σχεδιαστής Ταξιδιού AI", "Σχεδιάστε το Τέλειο Ταξίδι", "Δημιουργία Δρομολογίου"] },
  "cs": { name: "Čeština", strings: ["DOMŮ", "DESTINACE", "ZÁŽITKY", "Umění cestovat", "Vybraná elegance", "Objevte úchvatné destinace.", "Kam byste chtěli jet?", "Objevit", "Vybráno pro vás", "Prozkoumat zážitky", "Ručně vybraná místa", "Trendy destinace", "Prozkoumat vše", "Od", "Plánovač cest AI", "Navrhněte svou dokonalou cestu", "Vytvořit itinerář"] },
  "hu": { name: "Magyar", strings: ["FŐOLDAL", "ÚTICÉLOK", "ÉLMÉNYEK", "Az utazás művészete", "Válogatott elegancia", "Fedezzen fel lélegzetelállító úticélokat.", "Hová szeretne utazni?", "Felfedezés", "Önnek válogatva", "Élmények felfedezése", "Gondosan kiválasztott helyek", "Népszerű úticélok", "Összes felfedezése", "-tól", "MI Utazástervező", "Tervezze meg a tökéletes utazást", "Útiterv készítése"] },
  "ro": { name: "Română", strings: ["ACASĂ", "DESTINAȚII", "EXPERIENȚE", "Arta Călătoriei", "Eleganță Curată", "Descoperă destinații uluitoare.", "Unde ați dori să mergeți?", "Descoperă", "Creat Pentru Tine", "Explorează Experiențe", "Locații Alese", "Destinații Populare", "Explorează Tot", "De la", "Planificator AI", "Proiectează-ți Călătoria", "Generează Itinerar"] },
  "th": { name: "ไทย", strings: ["หน้าแรก", "จุดหมายปลายทาง", "ประสบการณ์", "ศิลปะแห่งการเดินทาง", "ความสง่างามที่คัดสรร", "ค้นพบจุดหมายปลายทางที่น่าทึ่ง", "คุณอยากไปที่ไหน?", "ค้นพบ", "คัดสรรเพื่อคุณ", "สำรวจประสบการณ์", "สถานที่ที่คัดสรรมาอย่างดี", "จุดหมายปลายทางยอดนิยม", "สำรวจทั้งหมด", "เริ่มต้น", "เครื่องมือวางแผน AI", "ออกแบบการเดินทางของคุณ", "สร้างแผนการเดินทาง"] },
  "vi": { name: "Tiếng Việt", strings: ["TRANG CHỦ", "ĐIỂM ĐẾN", "TRẢI NGHIỆM", "Nghệ Thuật Du Lịch", "Sự Thanh Lịch Được Tuyển Chọn", "Khám phá những điểm đến ngoạn mục.", "Bạn muốn đi đâu?", "Khám Phá", "Dành Riêng Cho Bạn", "Khám Phá Trải Nghiệm", "Địa Điểm Được Chọn Lọc", "Điểm Đến Phổ Biến", "Khám Phá Tất Cả", "Từ", "Lập Kế Hoạch AI", "Thiết Kế Chuyến Đi Của Bạn", "Tạo Lịch Trình"] },
  "id": { name: "Bahasa Indonesia", strings: ["BERANDA", "DESTINASI", "PENGALAMAN", "Seni Bepergian", "Keanggunan yang Dikurasi", "Temukan destinasi menakjubkan.", "Ke mana Anda ingin pergi?", "Temukan", "Dikurasi Untuk Anda", "Jelajahi Pengalaman", "Lokasi Pilihan", "Destinasi Populer", "Jelajahi Semua", "Dari", "Perencana AI", "Rancang Perjalanan Anda", "Buat Rencana"] },
  "ms": { name: "Bahasa Melayu", strings: ["LAMAN UTAMA", "DESTINASI", "PENGALAMAN", "Seni Perjalanan", "Keanggunan Terpilih", "Temui destinasi yang menakjubkan.", "Ke mana anda ingin pergi?", "Temui", "Dipilih Untuk Anda", "Terokai Pengalaman", "Lokasi Pilihan", "Destinasi Popular", "Terokai Semua", "Dari", "Perancang AI", "Reka Perjalanan Anda", "Jana Jadual"] },
  "bn": { name: "বাংলা", strings: ["হোম", "গন্তব্য", "অভিজ্ঞতা", "ভ্রমণের শিল্প", "নির্বাচিত কমনীয়তা", "আশ্চর্যজনক গন্তব্য আবিষ্কার করুন।", "আপনি কোথায় যেতে চান?", "আবিষ্কার করুন", "আপনার জন্য নির্বাচিত", "অভিজ্ঞতা অন্বেষণ করুন", "বাছাই করা স্থান", "জনপ্রিয় গন্তব্য", "সব দেখুন", "শুরু", "এআই পরিকল্পনাকারী", "আপনার যাত্রা ডিজাইন করুন", "ভ্রমণসূচি তৈরি করুন"] },
  "ta": { name: "தமிழ்", strings: ["முகப்பு", "இடங்கள்", "அனுபவங்கள்", "பயணத்தின் கலை", "தேர்ந்தெடுக்கப்பட்ட நேர்த்தி", "பிரமிக்க வைக்கும் இடங்களை கண்டறியவும்.", "நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்?", "கண்டறிக", "உங்களுக்காக தேர்ந்தெடுக்கப்பட்டது", "அனுபவங்களை ஆராயுங்கள்", "தேர்ந்தெடுக்கப்பட்ட இடங்கள்", "பிரபலமான இடங்கள்", "அனைத்தையும் ஆராயுங்கள்", "முதல்", "AI திட்டமிடுபவர்", "உங்கள் பயணத்தை வடிவமைக்கவும்", "பயணத்திட்டத்தை உருவாக்கு"] },
  "te": { name: "తెలుగు", strings: ["హోమ్", "గమ్యస్థానాలు", "అనుభవాలు", "ప్రయాణ కళ", "ఎంచుకున్న చక్కదనం", "అద్భుతమైన గమ్యస్థానాలను కనుగొనండి.", "మీరు ఎక్కడికి వెళ్లాలనుకుంటున్నారు?", "కనుగొనండి", "మీ కోసం ఎంచుకోబడింది", "అనుభవాలను అన్వేషించండి", "ఎంచుకున్న ప్రదేశాలు", "జనాదరణ పొందిన గమ్యస్థానాలు", "అన్నీ అన్వేషించండి", "నుండి", "AI ప్లానర్", "మీ ప్రయాణాన్ని రూపొందించండి", "ప్రయాణ ప్రణాళికను సృష్టించండి"] },
  "ur": { name: "اردو", strings: ["ہوم", "مقامات", "تجربات", "سفر کا فن", "منتخب خوبصورتی", "حیرت انگیز مقامات دریافت کریں۔", "آپ کہاں جانا چاہیں گے؟", "دریافت کریں", "آپ کے لیے منتخب", "تجربات دریافت کریں", "منتخب مقامات", "مقبول مقامات", "سب دیکھیں", "سے", "اے آئی منصوبہ ساز", "اپنا سفر ڈیزائن کریں", "سفرنامہ بنائیں"] }
};

const locales = Object.keys(languages);

// 1. Generate JSON files
for (const [code, lang] of Object.entries(languages)) {
  const [h1, h2, h3, h4, h5, h6, h7, h8, h9, h10, h11, h12, h13, h14, h15, h16, h17] = lang.strings;
  const json = {
    "Header": { "home": h1, "destinations": h2, "experiences": h3 },
    "Hero": { "subtitle": h4, "title": h5, "description": h6 },
    "Search": { "placeholder": h7, "button": h8 },
    "Categories": { "subtitle": h9, "title": h10 },
    "Destinations": { "subtitle": h11, "title": h12, "explore": h13, "from": h14 },
    "AITrip": { "title": h15, "subtitle": h16, "button": h17 }
  };
  fs.writeFileSync(path.join(__dirname, 'messages', `${code}.json`), JSON.stringify(json, null, 2));
}

// 2. Update request.ts
const reqTsPath = path.join(__dirname, 'src/i18n/request.ts');
let reqTs = fs.readFileSync(reqTsPath, 'utf8');
reqTs = reqTs.replace(/const locales = \[.*?\];/, `const locales = ${JSON.stringify(locales)};`);
fs.writeFileSync(reqTsPath, reqTs);

// 3. Update middleware.ts
const midTsPath = path.join(__dirname, 'src/middleware.ts');
let midTs = fs.readFileSync(midTsPath, 'utf8');
midTs = midTs.replace(/locales: \[.*?\],/, `locales: ${JSON.stringify(locales)},`);
midTs = midTs.replace(/matcher: \['\/', '\/\(.*?\)\/:path\*'\]/, `matcher: ['/', '/(${locales.join('|')})/:path*']`);
fs.writeFileSync(midTsPath, midTs);

// 4. Update Header.tsx
const headerPath = path.join(__dirname, 'src/components/Header.tsx');
let header = fs.readFileSync(headerPath, 'utf8');
header = header.replace(/\{\['en', 'es', 'fr', 'de', 'hi'\].map\(\(lang\) => \(/, `{${JSON.stringify(locales)}.map((lang) => (`);

const codeToNameMap = Object.entries(languages).map(([c, l]) => `lang === '${c}' ? '${l.name}' : `).join('');
header = header.replace(/\{lang === 'en' \? 'English' : lang === 'es' \? 'Español' : lang === 'fr' \? 'Français' : lang === 'de' \? 'Deutsch' : 'हिन्दी'\}/, `{${codeToNameMap} lang}`);
fs.writeFileSync(headerPath, header);

console.log(`Generated ${locales.length} languages successfully.`);
