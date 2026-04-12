import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  tr: {
    // App.jsx
    about: 'Hakkımda',
    logout: 'Çıkış Yap',
    addComponent: 'Komponent Ekle',
    projects: 'Projeler',
    components: 'Komponentler',
    componentLibrary: 'Komponent Kütüphanesi',
    noProjectsYet: 'Henüz Proje Yok',
    buildFirstProject: 'Aşağıdaki butona tıklayarak ilk projenizi inşa edin.',
    buildProject: 'Proje İnşa Et',
    subtitle: 'Donanım Tasarımı • Gömülü Sistemler • Malzeme Envanteri',
    searchPlaceholder: 'MCU, Op-Amp, Regülatör...',
    
    // LandingPage.jsx
    name: 'Ömer Faruk İlhan',
    jobTitle: 'Gömülü Sistemler ve Donanım Mühendisi',
    aboutHeader: 'Hakkımda',
    aboutP1: 'Elektronik tasarım ve gömülü sistemler dünyasında, karmaşık problemleri endüstriyel standartlarda donanım çözümlerine dönüştürmeye odaklanan bir mühendisim. Kariyerim boyunca yüksek hassasiyetli sensör entegrasyonundan, endüstriyel kontrol kartlarının (pozisyoner kartları vb.) mimari tasarımına kadar geniş bir yelpazede projeler yürüttüm.',
    aboutP2: 'Özellikle yüksek hassasiyetli sensör teknolojileri, 4-20mA akım döngüsü mimarileri ve endüstriyel kontrol sistemleri üzerine odaklanıyorum. Sadece devre tasarlamakla kalmıyor; yüksek gürültülü (EMI/EMC) fabrika ortamlarında kararlı çalışan, verimlilik odaklı ve uçtan uca entegre edilmiş akıllı donanım çözümleri geliştiriyorum.',
    techExpertise: 'Teknik Uzmanlık Alanlarım',
    expertise1Title: 'Mikrodenetleyiciler ve Gömülü Sistemler',
    expertise1Desc: 'STM32, PIC ve ATmega serileri başta olmak üzere çeşitli mikrodenetleyici mimarileri üzerinde C/C++ ile firmware geliştirme; I2C, SPI, UART ve RS485 haberleşme protokolleri.',
    expertise2Title: 'Donanım Tasarımı',
    expertise2Desc: 'Çok katmanlı PCB tasarımı (Autodesk Eagle, KiCad), Şematik Tasarım ve EMI/EMC uyumlu donanım mimarileri.',
    expertise3Title: 'Sensör Teknolojileri',
    expertise3Desc: 'Endüktif metal algılama, Hall-Effect sensörler ve yüksek tanımlı hassas veri toplama (ADC) sistemleri.',
    expertise4Title: 'Mekanik Entegrasyon',
    expertise4Desc: 'Elektronik kartlar için 3D modelleme ve koruyucu muhafaza (enclosure) tasarımı ile uçtan uca donanım/ürün geliştirme.',
    quote: '"Teknolojinin sınırlarını zorlayan projelerde yer almaktan ve karmaşık mühendislik zorluklarına yenilikçi çözümler üretmekten keyif alıyorum."',
    contactInfo: 'Sektörel iş birlikleri veya teknik fikir alışverişi için benimle her zaman iletişime geçebilirsiniz.',
    linkedin: 'LinkedIn Profili',
    enterBtn: 'Portfolyo / Dijital Laboratuvara Giriş',

    // Component/Project Shared
    searchBtn: 'Ara',
    noComponentFound: 'Bileşen bulunamadı. Lütfen arama kriterlerini değiştirin.',
    noProjectFound: 'Proje bulunamadı.',
    detailsBtn: 'Detay',
    inspectBtn: 'İncele',
    
    // Component Detail
    brandLabel: 'Marka:',
    typeLabel: 'Tip:',
    descLabel: 'Açıklama',
    datasheetBtn: 'Datasheet Görüntüle',
    buyBtn: 'Satın Al',
    editBtn: 'Düzenle',
    deleteBtn: 'Sil',
    
    // Project Detail
    schematicBtn: 'Şematik İncele',
    bomTitle: 'Kullanılan Malzemeler (BOM)',
    componentLabel: 'Bileşen',
    quantityLabel: 'Miktar',
    totalLabel: 'Toplam:',
    pieces: 'Adet',
    
    // AdminPanel / AddComponentForm
    dbSaveComp: 'Veritabanına Komponent Kaydet',
    projectWorkshop: 'Proje İnşa Atölyesi',
    mockModeWarning: 'Mock (Deneme) Modundasınız. Eklenen projeler ve BOM verileri sadece geçici olarak görünecektir.',
    projectName: 'Proje Adı *',
    coverImageUrl: 'Kapak Görseli URL',
    schematicPdfUrl: 'Şematik (PDF) URL',
    selectedBOM: 'Seçilen Malzemeler (BOM)',
    emptyCartTip: 'Sağdaki listeden bu projeye eklenecek komponentleri arayıp seçin.',
    searchLibrary: 'Kütüphaneden Ara',
    noResults: 'Sonuç bulunamadı.',
    cancelBtn: 'İptal',
    saveLiveBtn: 'Projeyi Canlıya Al',
    compNameInput: 'Bileşen Adı *',
    compTypeInput: 'Tipi *',
    compTypePh: 'Örn: Op-Amp',
    compBrandInput: 'Marka/Üretici',
    compTagsInput: 'Etiketler (Virgülle ayırın)',
    compTagsPh: 'Örn: Analog, Yükselteç, TI',
    compImageInput: 'Görsel URL (İsteğe bağlı)',
    saveBtn: 'Kaydet',
    successSaved: 'Sistem Kaydedildi!',

    // ConfirmModal
    areYouSure: 'Emin misiniz?',
    yesDeleteBtn: 'Evet, Sil',
  },
  en: {
    // App.jsx
    about: 'About Me',
    logout: 'Sign Out',
    addComponent: 'Add Component',
    projects: 'Projects',
    components: 'Components',
    componentLibrary: 'Component Library',
    noProjectsYet: 'No Projects Yet',
    buildFirstProject: 'Click the button below to build your first project.',
    buildProject: 'Build Project',
    subtitle: 'Hardware Design • Embedded Systems • Component Inventory',
    searchPlaceholder: 'MCU, Op-Amp, Regulator...',
    
    // LandingPage.jsx
    name: 'Ömer Faruk İlhan',
    jobTitle: 'Embedded Systems & Hardware Engineer',
    aboutHeader: 'About Me',
    aboutP1: 'In the world of electronic design and embedded systems, I am an engineer focused on transforming complex problems into industrial-standard hardware solutions. Throughout my career, I have executed a wide range of projects, from high-precision sensor integration to the architectural design of industrial control boards (e.g., positioner boards).',
    aboutP2: 'I focus specifically on high-precision sensor technologies, 4-20mA current loop architectures, and industrial control systems. I don\'t just design circuits; I develop efficiency-driven, end-to-end intelligent hardware solutions that operate stably in high-noise (EMI/EMC) factory environments.',
    techExpertise: 'My Technical Expertise',
    expertise1Title: 'Microcontrollers & Embedded Systems',
    expertise1Desc: 'Firmware development with C/C++ on various microcontroller architectures, primarily STM32, PIC, and ATmega series; I2C, SPI, UART, and RS485 communication protocols.',
    expertise2Title: 'Hardware Design',
    expertise2Desc: 'Multi-layer PCB design (Autodesk Eagle, KiCad), Schematic Design, and EMI/EMC compliant hardware architectures.',
    expertise3Title: 'Sensor Technologies',
    expertise3Desc: 'Inductive metal detection, Hall-Effect sensors, and high-definition precision data acquisition (ADC) systems.',
    expertise4Title: 'Mechanical Integration',
    expertise4Desc: 'End-to-end hardware/product development with 3D modeling and protective enclosure design for electronic boards.',
    quote: '"I enjoy being part of projects that push the boundaries of technology and producing innovative solutions to complex engineering challenges."',
    contactInfo: 'You can always contact me for industry collaborations or technical brainstorming.',
    linkedin: 'LinkedIn Profile',
    enterBtn: 'Enter Portfolio / Digital Laboratory',

    // Component/Project Shared
    searchBtn: 'Search',
    noComponentFound: 'No components found. Please change your search criteria.',
    noProjectFound: 'No projects found.',
    detailsBtn: 'Details',
    inspectBtn: 'Inspect',
    
    // Component Detail
    brandLabel: 'Brand:',
    typeLabel: 'Type:',
    descLabel: 'Description',
    datasheetBtn: 'View Datasheet',
    buyBtn: 'Buy Now',
    editBtn: 'Edit',
    deleteBtn: 'Delete',
    
    // Project Detail
    schematicBtn: 'View Schematic',
    bomTitle: 'Bill of Materials (BOM)',
    componentLabel: 'Component',
    quantityLabel: 'Quantity',
    totalLabel: 'Total:',
    pieces: 'pcs',
    
    // AdminPanel / AddComponentForm
    dbSaveComp: 'Save Component to Database',
    projectWorkshop: 'Project Build Workshop',
    mockModeWarning: 'You are in Mock Mode. Added projects and BOM data will only appear temporarily.',
    projectName: 'Project Name *',
    coverImageUrl: 'Cover Image URL',
    schematicPdfUrl: 'Schematic (PDF) URL',
    selectedBOM: 'Selected Materials (BOM)',
    emptyCartTip: 'Search and select components from the list on the right to add to this project.',
    searchLibrary: 'Search Library',
    noResults: 'No results found.',
    cancelBtn: 'Cancel',
    saveLiveBtn: 'Publish Project Live',
    compNameInput: 'Component Name *',
    compTypeInput: 'Type *',
    compTypePh: 'E.g: Op-Amp',
    compBrandInput: 'Brand/Mfr',
    compTagsInput: 'Tags (Comma separated)',
    compTagsPh: 'E.g: Analog, Amplifier, TI',
    compImageInput: 'Image URL (Optional)',
    saveBtn: 'Save',
    successSaved: 'System Saved!',

    // ConfirmModal
    areYouSure: 'Are You Sure?',
    yesDeleteBtn: 'Yes, Delete',
  }
};

export const LanguageProvider = ({ children }) => {
  // Try to load language from localStorage, otherwise default to 'tr'
  const [lang, setLangState] = useState(() => {
    const savedLang = localStorage.getItem('app_language');
    return savedLang || 'tr';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('app_language', newLang);
  };

  const t = translations[lang] || translations['tr'];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
