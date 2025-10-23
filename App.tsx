import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import WantedPoster from './components/WantedPoster';
import Loader from './components/Loader';
import { generateBounty } from './services/geminiService';
import type { WantedData } from './types';

const developerPhotoBase64 = 'data:image/jpeg;base64,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';

const App: React.FC = () => {
  const [approvedWarrants, setApprovedWarrants] = useState<WantedData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerBalance, setPlayerBalance] = useState<number>(5000);

  const handleGenerate = async (name: string, crime: string, photo: File) => {
    setIsLoading(true);
    setError(null);
    
    const fileToBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    try {
      const photoUrl = await fileToBase64(photo);
      const bounty = await generateBounty(crime);
      
      const newWarrant: WantedData = {
        name,
        crime,
        bounty,
        photoUrl,
        issueTimestamp: Date.now(),
      };

      setApprovedWarrants(prevData => [newWarrant, ...prevData]);
      setPlayerBalance(prevBalance => prevBalance + 1000);

    } catch (err) {
      setError('Failed to process warrant. Please check the image and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCatch = (indexToCatch: number) => {
    const warrant = approvedWarrants[indexToCatch];
    if (warrant) {
      setPlayerBalance(prevBalance => prevBalance + warrant.bounty);
      setApprovedWarrants(prev => prev.filter((_, index) => index !== indexToCatch));
    }
  };

  const handleReset = () => {
    setApprovedWarrants([]);
  };

  return (
    <div 
        className="min-h-screen bg-cover bg-center bg-fixed text-white" 
        style={{backgroundImage: "url('https://picsum.photos/seed/los-santos/1920/1080')"}}
    >
      <div className="min-h-screen bg-black/60 backdrop-blur-sm relative">
        <Header playerBalance={playerBalance} />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="gta-font text-4xl md:text-5xl">WANTED POSTER GENERATOR</h2>
            <p className="mt-2 text-lg text-gray-300">
              Step into the shoes of the LSPD. File a report on a suspect, detail their crimes, and our advanced system will calculate and issue an official bounty.
            </p>
          </div>

          <InputForm onSubmit={handleGenerate} isLoading={isLoading} />
          
          {error && (
            <div className="text-center bg-red-500/80 p-3 rounded-md max-w-lg mx-auto mt-6 gta-font">
              {error}
            </div>
          )}

          {isLoading && <Loader />}

          {approvedWarrants.length > 0 && !isLoading && (
            <div className="text-center my-8">
                <button 
                  onClick={handleReset}
                  className="gta-font bg-blue-600 text-white text-lg py-2 px-6 rounded-md hover:bg-blue-700 active:bg-blue-800 transition-all duration-200"
                >
                  Start New Investigation
                </button>
            </div>
          )}

          {approvedWarrants.length > 0 && (
             <h3 className="gta-font text-3xl text-center text-white mt-12 mb-6 border-b-2 border-gray-600 pb-2">
              Active Warrants
            </h3>
          )}
          
          <div className="flex flex-wrap items-start justify-center gap-8">
            {approvedWarrants.map((data, index) => (
              <WantedPoster key={`${data.name}-${index}`} data={data} onCatch={() => handleCatch(index)} />
            ))}
          </div>

        </main>
        <footer className="text-center p-4 text-gray-400 text-sm">
            <p>This is a fan-made application for entertainment purposes only. Not affiliated with Rockstar Games.</p>
        </footer>
        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 p-2 rounded-lg">
            <img src={developerPhotoBase64} alt="Developer logo" className="w-10 h-10 rounded-full object-cover border-2 border-gray-500" />
            <p className="text-gray-300 text-sm font-semibold gta-font tracking-wider">Made by Aarav</p>
        </div>
      </div>
    </div>
  );
};

export default App;
