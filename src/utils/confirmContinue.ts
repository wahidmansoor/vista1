export const confirmContinue = (language: string = 'en'): string => {
  const translations: { [key: string]: string; en: string; de: string } = {
    en: 'Continue to iterate?',
    de: 'Weiter iterieren?'
  };
  
  return translations[language] || translations['en'];
};
