import React from 'react';

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface HeaderProps {
  playerBalance: number;
}

const Header: React.FC<HeaderProps> = ({ playerBalance }) => {
  return (
    <header className="w-full bg-black/70 backdrop-blur-sm p-4 border-b-4 border-blue-500 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <StarIcon />
                <StarIcon />
            </div>
            <div className="gta-font text-2xl text-green-400 hidden sm:block">
                ${playerBalance.toLocaleString()}
            </div>
        </div>
        <h1 className="gta-font text-2xl md:text-4xl text-white tracking-wider text-center">
          Los Santos Police Department
        </h1>
        <div className="flex items-center gap-2">
            <StarIcon />
            <StarIcon />
        </div>
      </div>
    </header>
  );
};

export default Header;
