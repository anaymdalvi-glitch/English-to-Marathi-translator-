import React, { useState, useCallback } from 'react';
import { Language } from './types';
import { translateText } from './services/geminiService';
import LanguageSelector from './components/LanguageSelector';
import Loader from './components/Loader';
import { DownloadIcon } from './components/icons/DownloadIcon';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<Language>(Language.Marathi);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to translate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const result = await translateText(inputText, targetLanguage);
      setTranslatedText(result);
    } catch (err) {
      setError('Failed to translate. Please check your API key and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [inputText, targetLanguage]);

  const handleDownload = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation-${targetLanguage}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            AI Language Translator
          </h1>
          <p className="text-slate-400 mt-2 text-lg">
            Translate English to Marathi and Hindi with ease.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="bg-slate-800 rounded-xl p-6 flex flex-col shadow-lg">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">English</h2>
            <div className="relative flex-grow">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter text to translate..."
                className="w-full h-full min-h-[300px] bg-slate-900 text-slate-300 p-4 rounded-md resize-none border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 transition-colors duration-300"
                maxLength={20000}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {inputText.length} / 20000
              </div>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-slate-800 rounded-xl p-6 flex flex-col shadow-lg">
            <LanguageSelector
              selectedLanguage={targetLanguage}
              onSelectLanguage={setTargetLanguage}
            />
            <div className="relative flex-grow mt-4 bg-slate-900 rounded-md border-2 border-slate-700">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 bg-opacity-75 rounded-md z-10">
                  <Loader />
                </div>
              )}
              {error && (
                 <div className="absolute inset-0 flex items-center justify-center p-4">
                    <p className="text-red-400 text-center">{error}</p>
                 </div>
              )}
              <div className="w-full h-full min-h-[300px] p-4 text-slate-300 overflow-y-auto">
                {translatedText ? (
                    <p className="whitespace-pre-wrap">{translatedText}</p>
                ) : (
                    !isLoading && !error && <span className="text-slate-500">Translation will appear here...</span>
                )}
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105 disabled:scale-100"
          >
            {isLoading ? 'Translating...' : 'Translate'}
          </button>
           <button
            onClick={handleClear}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 font-semibold text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors duration-300"
          >
            Clear
          </button>
          <button
            onClick={handleDownload}
            disabled={!translatedText || isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-pink-600 rounded-lg shadow-md hover:bg-pink-700 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-pink-500 transition-all duration-300 disabled:opacity-50"
          >
            <DownloadIcon />
            Download
          </button>
        </footer>
      </div>
    </div>
  );
};

export default App;