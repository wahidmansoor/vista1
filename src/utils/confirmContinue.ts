export const confirmContinue = (language: string = 'en'): string => {
  const translations = {
    en: 'Continue to iterate?',
    de: 'Weiter iterieren?'
  };
  
  return translations[language] || translations['en'];
};
