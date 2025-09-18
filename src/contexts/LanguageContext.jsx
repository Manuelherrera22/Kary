import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { translations as baseTranslations, availableLanguages, t as translateFunction } from '@/locales/config';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es'); 
  const [currentTranslations, setCurrentTranslations] = useState(baseTranslations['es']);
  const { toast } = useToast();

  const changeLanguage = useCallback(async (langCode) => {
    if (baseTranslations[langCode]) {
      setLanguage(langCode);
      setCurrentTranslations(baseTranslations[langCode]);
      localStorage.setItem('kary_language', langCode);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ preferred_language: langCode })
          .eq('id', user.id);
        if (error) {
          console.error('Error updating user language preference:', error);
          toast({
            title: "Error",
            description: "Could not save language preference.",
            variant: "destructive",
          });
        }
      }
    } else {
      console.warn(`Attempted to change to unsupported language: ${langCode}. Defaulting to 'es'.`);
      if (language !== 'es') {
        setLanguage('es');
        setCurrentTranslations(baseTranslations['es']);
        localStorage.setItem('kary_language', 'es');
      }
    }
  }, [toast, language]); 
  
  useEffect(() => {
    const storedLang = localStorage.getItem('kary_language');
    const browserLang = typeof window !== 'undefined' && window.navigator ? window.navigator.language.split('-')[0] : 'es';
    
    let initialLang = 'es'; 
    if (storedLang && baseTranslations[storedLang]) {
      initialLang = storedLang;
    } else if (baseTranslations[browserLang]) {
      initialLang = browserLang;
    }

    setLanguage(initialLang);
    setCurrentTranslations(baseTranslations[initialLang] || baseTranslations['es']);

    const fetchUserLanguage = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('preferred_language')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching user profile for language:', error);
        } else if (profile && profile.preferred_language && baseTranslations[profile.preferred_language]) {
          if (profile.preferred_language !== initialLang) {
            setLanguage(profile.preferred_language);
            setCurrentTranslations(baseTranslations[profile.preferred_language]);
            localStorage.setItem('kary_language', profile.preferred_language);
          }
        }
      }
    };
    fetchUserLanguage();
  }, []);

  const t = useCallback((key, fallbackOrParams = '', paramsIfFallbackExists = {}) => {
    return translateFunction(key, language, typeof fallbackOrParams === 'object' ? fallbackOrParams : paramsIfFallbackExists);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, loadingTranslations: false, availableLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};