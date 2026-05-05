import React, { createContext, useContext, useState, useEffect } from 'react';

export type Lang = 'fr' | 'en' | 'ar';

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'fr',
  setLang: () => {},
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('siteLang') as Lang) || 'fr';
  });

  const isRTL = lang === 'ar';

  const handleSetLang = (l: Lang) => {
    setLang(l);
    localStorage.setItem('siteLang', l);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', lang);
  }, [lang, isRTL]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};
