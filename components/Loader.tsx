import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pink-500"></div>
      <p className="gta-font text-white text-xl tracking-wider">Contacting Dispatch...</p>
    </div>
  );
};

export default Loader;
