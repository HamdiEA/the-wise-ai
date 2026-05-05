import { Lang } from '@/context/LanguageContext';

const t = {
  nav: {
    menu: { fr: 'Menu', en: 'Menu', ar: 'القائمة' },
    contact: { fr: 'Contact', en: 'Contact', ar: 'تواصل معنا' },
    address: { fr: 'Adresses', en: 'Addresses', ar: 'العناوين' },
    backHome: { fr: "Retour à l'accueil", en: 'Back to home', ar: 'العودة للرئيسية' },
  },
  hero: {
    tagline: {
      fr: 'Choisissez Votre Nourriture Sagement',
      en: 'Choose Your Food Wisely',
      ar: 'اختر طعامك بحكمة',
    },
    subtitle: {
      fr: 'Une expérience culinaire raffinée au cœur de la Tunisie. Cuisine méditerranéenne, pizzas artisanales et saveurs authentiques.',
      en: 'A refined culinary experience in the heart of Tunisia. Mediterranean cuisine, artisan pizzas and authentic flavors.',
      ar: 'تجربة طهي راقية في قلب تونس. مطبخ متوسطي، بيتزا حرفية ونكهات أصيلة.',
    },
    cta: { fr: 'Découvrir le menu', en: 'Explore the menu', ar: 'استكشف القائمة' },
    ctaSecondary: { fr: 'Nous contacter', en: 'Contact us', ar: 'اتصل بنا' },
    scrollHint: { fr: 'Défiler', en: 'Scroll', ar: 'مرر' },
    stats: {
      dishes:  { fr: 'Plats uniques',      en: 'Unique dishes',      ar: 'أطباق فريدة'    },
      locations: { fr: 'Adresses',          en: 'Locations',          ar: 'فروع'           },
      years:   { fr: "Années d'excellence", en: 'Years of excellence', ar: 'سنوات التميز'  },
    },
    badge: { fr: 'Ouvert tous les jours · 12h–23h', en: 'Open daily · 12pm–11pm', ar: 'مفتوح يومياً · 12م–11م' },
    videoPlaceholder: { fr: 'Vidéo à venir', en: 'Video coming soon', ar: 'فيديو قريباً' },
  },
  info: {
    sectionLabel: { fr: 'Adresses & horaires', en: 'Addresses & hours', ar: 'العناوين والمواعيد' },
    title: { fr: 'Horaires & Coordonnées', en: 'Hours & Locations', ar: 'ساعات العمل والمواقع' },
    subtitle: {
      fr: 'Visitez-nous dans nos 3 emplacements. Commandez ou réservez par téléphone.',
      en: 'Visit us at our 3 locations. Order or reserve by phone.',
      ar: 'قم بزيارتنا في أحد فروعنا الثلاثة. اطلب أو احجز عبر الهاتف.',
    },
    viewMenu: { fr: 'Voir le menu', en: 'View menu', ar: 'عرض القائمة' },
    hours: { fr: 'Tous les jours : 12h00 – 23h00', en: 'Every day : 12:00 – 23:00', ar: 'كل يوم : 12:00 – 23:00' },
    follow: { fr: 'Suivez-nous', en: 'Follow us', ar: 'تابعونا' },
  },
  chat: {
    sectionLabel: { fr: 'Assistant intelligent', en: 'Smart assistant', ar: 'المساعد الذكي' },
    title: { fr: 'The Wise', en: 'The Wise', ar: 'The Wise' },
    titleSuffix: { fr: 'Assistant', en: 'Assistant', ar: 'المساعد' },
    desc: {
      fr: 'Discutez avec notre assistant IA pour :',
      en: 'Chat with our AI assistant to:',
      ar: 'تحدث مع مساعدنا الذكي من أجل:',
    },
    features: {
      fr: [
        'Recommander des plats selon vos envies.',
        'Vérifier rapidement les ingrédients ou allergènes.',
        'Préparer votre commande avant de passer en caisse.',
        'Découvrir nos offres et suggestions du chef.',
      ],
      en: [
        'Recommend dishes based on your preferences.',
        'Quickly check ingredients or allergens.',
        'Prepare your order before checkout.',
        'Discover our offers and chef suggestions.',
      ],
      ar: [
        'التوصية بالأطباق حسب رغبتك.',
        'التحقق سريعاً من المكونات أو مسببات الحساسية.',
        'تحضير طلبك قبل الدفع.',
        'اكتشاف عروضنا واقتراحات الشيف.',
      ],
    },
    tip: { fr: 'Astuce', en: 'Tip', ar: 'نصيحة' },
    tipText: {
      fr: "Ouvrez l'assistant flottant en bas à droite pour démarrer la conversation à tout moment.",
      en: 'Open the floating assistant at the bottom right to start chatting at any time.',
      ar: 'افتح المساعد العائم في أسفل اليمين لبدء المحادثة في أي وقت.',
    },
    available: { fr: 'Disponible 24/7', en: 'Available 24/7', ar: 'متاح 24/7' },
    online: { fr: 'En ligne', en: 'Online', ar: 'متصل' },
    demoGreeting: {
      fr: "Bonjour ! Quels sont vos goûts ou allergies aujourd'hui ?",
      en: "Hello! What are your tastes or allergies today?",
      ar: "مرحباً! ما هي أذواقك أو حساسيتك اليوم؟",
    },
    demoUserMsg: {
      fr: "Je suis allergique aux fruits de mer.",
      en: "I'm allergic to seafood.",
      ar: "لدي حساسية من المأكولات البحرية.",
    },
    demoReply: {
      fr: "Parfait. Je vous recommande nos pizzas Margherita ou Pepperoni, et nos burgers maison. À éviter : section Fruits de Mer.",
      en: "Perfect. I recommend our Margherita or Pepperoni pizzas, and our house burgers. Avoid: the Seafood section.",
      ar: "ممتاز. أنصحك ببيتزا مارغريتا أو بيبروني وبرغرنا المنزلي. تجنب: قسم المأكولات البحرية.",
    },
  },
  footer: {
    tagline: {
      fr: "Choisissez Votre Nourriture Sagement — Découvrez une cuisine exceptionnelle dans nos trois emplacements en Tunisie.",
      en: "Choose Your Food Wisely — Discover exceptional cuisine at our three locations in Tunisia.",
      ar: "اختر طعامك بحكمة — اكتشف مطبخاً استثنائياً في فروعنا الثلاثة بتونس.",
    },
    hours: {
      fr: 'Ouvert tous les jours · 12h00 – 23h00',
      en: 'Open every day · 12:00 – 23:00',
      ar: 'مفتوح كل يوم · 12:00 – 23:00',
    },
    rights: {
      fr: '© 2025 The Wise Restaurant. Tous droits réservés.',
      en: '© 2025 The Wise Restaurant. All rights reserved.',
      ar: '© 2025 The Wise Restaurant. جميع الحقوق محفوظة.',
    },
    reviews: { fr: 'Avis', en: 'Reviews', ar: 'تقييمات' },
  },
  menu: {
    title: { fr: 'Notre Carte', en: 'Our Menu', ar: 'قائمتنا' },
    subtitle: {
      fr: 'Choisissez une catégorie pour découvrir nos plats',
      en: 'Choose a category to discover our dishes',
      ar: 'اختر فئة لاكتشاف أطباقنا',
    },
    label: { fr: 'Menu', en: 'Menu', ar: 'القائمة' },
    viewCategory: { fr: 'Voir la catégorie', en: 'View category', ar: 'عرض الفئة' },
    categories: {
      appetizers: {
        title: { fr: '🥗 Entrées', en: '🥗 Appetizers', ar: '🥗 المقبلات' },
        desc: { fr: 'Salades et entrées chaudes', en: 'Salads and hot starters', ar: 'سلطات ومقبلات ساخنة' },
      },
      mainCourses: {
        title: { fr: '🥩 Plats Principaux', en: '🥩 Main Courses', ar: '🥩 الأطباق الرئيسية' },
        desc: { fr: 'Volailles, viandes et fruits de mer', en: 'Poultry, meats and seafood', ar: 'دواجن ولحوم ومأكولات بحرية' },
      },
      pasta: {
        title: { fr: '🍝 Pâtes', en: '🍝 Pasta', ar: '🍝 المعكرونة' },
        desc: { fr: 'Pâtes italiennes et sauces maison', en: 'Italian pasta and homemade sauces', ar: 'معكرونة إيطالية وصلصات منزلية' },
      },
      pizzas: {
        title: { fr: '🍕 Pizzas', en: '🍕 Pizzas', ar: '🍕 البيتزا' },
        desc: { fr: 'Pizzas traditionnelles et spéciales', en: 'Traditional and special pizzas', ar: 'بيتزا تقليدية وخاصة' },
      },
      sandwiches: {
        title: { fr: '🥪 Sandwichs & Burgers', en: '🥪 Sandwiches & Burgers', ar: '🥪 سندويشات وبرغر' },
        desc: { fr: 'Ciabata, baguette et burgers', en: 'Ciabata, baguette and burgers', ar: 'سياباتا وباجيت وبرغر' },
      },
      specials: {
        title: { fr: '🍗 Spécial The Wise', en: '🍗 The Wise Specials', ar: '🍗 مميزات The Wise' },
        desc: { fr: 'Box chicken, bowls et menus enfants', en: 'Chicken boxes, bowls and kids menus', ar: 'صناديق دجاج وبولز وقوائم أطفال' },
      },
      snacks: {
        title: { fr: '🧁 Snacks & Desserts', en: '🧁 Snacks & Desserts', ar: '🧁 سناكس وحلويات' },
        desc: { fr: 'Crêpes, gaufres et douceurs', en: 'Crepes, waffles and sweets', ar: 'كريب وغوفر وحلويات' },
      },
      drinks: {
        title: { fr: '🥤 Boissons', en: '🥤 Drinks', ar: '🥤 المشروبات' },
        desc: { fr: 'Cocktails, jus et boissons chaudes', en: 'Cocktails, juices and hot drinks', ar: 'كوكتيل وعصائر ومشروبات ساخنة' },
      },
    },
  },
  ai: {
    langEN: { fr: 'EN', en: 'EN', ar: 'EN' },
    langFR: { fr: 'FR', en: 'FR', ar: 'FR' },
    langAR: { fr: 'عر', en: 'عر', ar: 'عر' },
    clear: { fr: 'Effacer', en: 'Clear', ar: 'مسح' },
    concierge: { fr: 'Concierge menu', en: 'Menu concierge', ar: 'مستشار القائمة' },
    howHelp: { fr: 'Comment puis-je aider ?', en: 'How may I help?', ar: 'كيف يمكنني المساعدة؟' },
    askMenu: { fr: 'Demandez-moi le menu', en: 'Ask me about the menu', ar: 'اسألني عن القائمة' },
    askMenuDesc: {
      fr: "Je peux suggérer des plats, expliquer les ingrédients, respecter un budget et aider avec les allergènes.",
      en: "I can suggest dishes, explain ingredients, respect budgets, and help with allergens.",
      ar: "أستطيع اقتراح الأطباق وشرح المكونات ومراعاة الميزانية والمساعدة بشأن الحساسية.",
    },
    placeholder: {
      fr: 'Menu, ingrédients, budget, allergènes...',
      en: 'Menu, ingredients, budget, allergens...',
      ar: 'القائمة، المكونات، الميزانية، الحساسية...',
    },
    send: { fr: '→', en: '→', ar: '←' },
    limit: { fr: 'Limite', en: 'Limit', ar: 'الحد' },
    loading: { fr: '…', en: '…', ar: '…' },
    starters: {
      fr: ["Recommande un dîner pour 2", "Quels plats sans gluten ?", "Je veux quelque chose de léger"],
      en: ["Recommend a dinner for 2", "What dishes are gluten-free?", "I want something light"],
      ar: ["اقترح عشاء لشخصين", "ما الأطباق الخالية من الغلوتين؟", "أريد شيئاً خفيفاً"],
    },
    remaining: { fr: 'messages restants', en: 'messages left', ar: 'رسائل متبقية' },
    reset: { fr: '· réinit. 12h', en: '· 12h reset', ar: '· إعادة تعيين 12س' },
    availableIn: { fr: 'Disponible dans', en: 'Available in', ar: 'متاح في' },
    initializing: { fr: "Initialisation...", en: "Initializing...", ar: "جارٍ التهيئة..." },
    errorSend: {
      fr: "Impossible d'envoyer. Réessayez.",
      en: "Could not send. Please try again.",
      ar: "تعذّر الإرسال. حاول مرة أخرى.",
    },
    limitReached: { fr: "Limite atteinte. Patientez.", en: "Limit reached. Please wait.", ar: "تم الوصول للحد. انتظر." },
    noKey: {
      fr: "Configuration serveur manquante. Ajoutez OPENROUTER_API_KEY et JWT_SECRET dans les variables d'environnement.",
      en: "Missing server configuration. Add OPENROUTER_API_KEY and JWT_SECRET in environment variables.",
      ar: "Missing server configuration. Add OPENROUTER_API_KEY and JWT_SECRET in environment variables.",
    },
  },
};

export function tr(key: { fr: string; en: string; ar: string }, lang: Lang): string {
  return key[lang] ?? key['fr'];
}

export function trArr(key: { fr: string[]; en: string[]; ar: string[] }, lang: Lang): string[] {
  return key[lang] ?? key['fr'];
}

export default t;

