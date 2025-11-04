import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelectLanguage: (language: Language) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
}) => {
  const languages = Object.values(Language);

  return (
    <div className="flex items-center justify-between">
       <h2 className="text-2xl font-bold text-slate-200">
         {selectedLanguage}
       </h2>
       <div className="flex bg-slate-700 p-1 rounded-lg">
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelectLanguage(lang)}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${
              selectedLanguage === lang
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-300 hover:bg-slate-600'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
