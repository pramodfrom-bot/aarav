import React, { useState, useEffect, useRef } from 'react';

interface InputFormProps {
  onSubmit: (name: string, crime: string, photo: File) => void;
  isLoading: boolean;
}

const GTA_CRIMES = [
  'Grand Theft Auto',
  'Bank Robbery',
  'Smuggling',
  'Drug Trafficking',
  'Assault',
  'Murder',
  'Arms Dealing',
  'Police Evasion',
  'Street Racing',
  'Hijacking',
  'Extortion',
  'Kidnapping',
  'Arson',
  'Money Laundering',
  'Racketeering',
];


const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [crime, setCrime] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showReward, setShowReward] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Revoke the object URL to avoid memory leaks
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);


  const handleCrimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCrime(value);
    if (value) {
      const filteredSuggestions = GTA_CRIMES.filter(suggestion =>
        suggestion.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCrime(suggestion);
    setSuggestions([]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && crime && photo && !isLoading) {
      onSubmit(name, crime, photo);
      setName('');
      setCrime('');
      handleRemovePhoto();
      setShowReward(true);
      setTimeout(() => {
        setShowReward(false);
      }, 2000);
    }
  };

  return (
    <div ref={formRef} className="w-full max-w-lg mx-auto bg-gray-800/80 p-6 rounded-lg shadow-2xl border border-gray-700 mt-8">
      <h2 className="gta-font text-2xl text-white text-center mb-6">File a Bounty Report</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-300 mb-1 gta-font">Suspect's Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Trevor Philips"
            className="w-full bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200 placeholder-gray-500"
            required
          />
        </div>
        <div className="relative">
          <label htmlFor="crime" className="block text-sm font-bold text-gray-300 mb-1 gta-font">Known Infractions</label>
          <input
            id="crime"
            type="text"
            value={crime}
            onChange={handleCrimeChange}
            autoComplete="off"
            placeholder="e.g., Smuggling, bank robbery"
            className="w-full bg-gray-900 border border-gray-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition duration-200 placeholder-gray-500"
            required
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-900 border border-gray-600 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-3 py-2 text-white cursor-pointer hover:bg-pink-600 transition-colors duration-150"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
            <label className="block text-sm font-bold text-gray-300 mb-1 gta-font">Suspect Mugshot</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                {photoPreview ? (
                    <div className="relative group w-32 mx-auto">
                        <img src={photoPreview} alt="Suspect preview" className="mx-auto h-32 w-32 rounded-md object-cover" />
                        <div 
                            onClick={handleRemovePhoto} 
                            className="absolute top-0 right-0 -mt-2 -mr-2 flex items-center justify-center h-6 w-6 bg-red-600 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </div>
                    </div>
                ) : (
                    <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-500">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-900 rounded-md font-medium text-pink-500 hover:text-pink-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-pink-500 px-1">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handlePhotoChange} ref={fileInputRef} required />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                )}
                </div>
            </div>
        </div>
        <div className="relative pt-2">
          <button
            type="submit"
            disabled={isLoading || !name || !crime || !photo}
            className="w-full gta-font bg-pink-600 text-white text-xl py-2 rounded-md hover:bg-pink-700 active:bg-pink-800 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Bounty...
              </>
            ) : (
              'Issue Warrant'
            )}
          </button>
           <div className={`absolute -top-8 left-1/2 -translate-x-1/2 gta-font text-3xl text-green-400 font-bold transition-all duration-1000 ease-out pointer-events-none ${showReward ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
            +$1,000
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputForm;