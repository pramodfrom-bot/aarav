import React, { useState, useEffect } from 'react';
import type { WantedData } from '../types';

interface WantedPosterProps {
  data: WantedData;
  onCatch: () => void;
}

const CATCH_DELAY_SECONDS = 120; // 2 minutes

const WantedPoster: React.FC<WantedPosterProps> = ({ data, onCatch }) => {
  const [isApproved, setIsApproved] = useState(false);
  const [isCaught, setIsCaught] = useState(false);
  const [timeLeft, setTimeLeft] = useState(CATCH_DELAY_SECONDS);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const timeElapsed = Date.now() - data.issueTimestamp;
      const timeRemaining = (CATCH_DELAY_SECONDS * 1000) - timeElapsed;
      return Math.max(0, Math.ceil(timeRemaining / 1000));
    };

    setTimeLeft(calculateTimeLeft());

    if (calculateTimeLeft() > 0) {
      const timer = setInterval(() => {
        const remaining = calculateTimeLeft();
        setTimeLeft(remaining);
        if (remaining === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [data.issueTimestamp]);


  const handleCatchClick = () => {
    const isCatchable = timeLeft === 0;
    if (isCaught || !isCatchable || isApproved) {
        return;
    }

    setIsApproved(true);

    // Sequence: Approved (1.5s) -> Caught (2s) -> onCatch()
    setTimeout(() => {
        setIsCaught(true);
        setTimeout(() => {
            onCatch();
        }, 2000); // "Caught" animation duration
    }, 1500); // "Approved" animation duration
  };

  const isCatchable = timeLeft === 0;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  return (
    <div className="w-full max-w-lg mx-auto bg-[#fceed5] text-black p-4 rounded-md shadow-2xl border-4 border-black my-8 animate-fade-in relative overflow-hidden">
      <div className={`transition-all duration-500 ${isCaught || isApproved ? 'filter blur-sm brightness-50' : ''}`}>
        <div className="border-2 border-black p-4">
          <h2 className="gta-font text-7xl text-center font-bold tracking-tighter">WANTED</h2>
          <p className="gta-font text-center text-2xl mb-4">DEAD OR ALIVE</p>
          
          <div className="w-full aspect-[4/3] bg-gray-300 border-2 border-black mb-4 overflow-hidden">
            <img 
              src={data.photoUrl} 
              alt={`Mugshot of ${data.name}`} 
              className="w-full h-full object-cover grayscale"
            />
          </div>

          <div className="text-center mb-4">
            <h3 className="gta-font text-4xl leading-none">{data.name}</h3>
            <p className="text-lg mt-2 font-semibold capitalize italic">"{data.crime}"</p>
          </div>
          
          <div className="bg-black text-white p-2 text-center">
            <p className="gta-font text-2xl tracking-wide">BOUNTY</p>
            <p className="gta-font text-5xl font-bold text-yellow-300">${data.bounty.toLocaleString()}</p>
          </div>
        </div>
        <p className="text-xs text-center mt-2 text-gray-600">L.S.P.D. OFFICIAL DOCUMENT</p>
      </div>

      <button
        onClick={handleCatchClick}
        disabled={isCaught || !isCatchable || isApproved}
        className="w-full gta-font bg-green-600 text-white text-xl mt-4 py-2 rounded-md hover:bg-green-700 active:bg-green-800 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isApproved
            ? 'PROCESSING...'
            : isCaught 
            ? 'COLLECTING BOUNTY...' 
            : isCatchable 
            ? 'Catch Suspect' 
            : `Trackdown in ${formatTime(timeLeft)}`}
      </button>

      {isApproved && !isCaught && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-fade-in pointer-events-none p-4">
          <h2 className="gta-font text-8xl md:text-9xl text-green-500 transform -rotate-12 border-8 border-green-500 p-4 bg-black/20" style={{ textShadow: '4px 4px 0 #000' }}>
            APPROVED
          </h2>
        </div>
      )}

      {isCaught && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-fade-in pointer-events-none p-4">
          <h2 className="gta-font text-8xl md:text-9xl text-red-600 transform -rotate-12 border-8 border-red-600 p-4 bg-black/20" style={{ textShadow: '4px 4px 0 #000' }}>
            CAUGHT
          </h2>
          <p className="gta-font text-5xl md:text-6xl text-green-400 mt-4" style={{ textShadow: '3px 3px 0 #000' }}>
            +${data.bounty.toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default WantedPoster;