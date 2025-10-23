import React from 'react';
import type { WantedData } from '../types';

interface ApprovalQueueProps {
  warrants: WantedData[];
  onApprove: (index: number) => void;
  onDeny: (index: number) => void;
}

const ApprovalQueue: React.FC<ApprovalQueueProps> = ({ warrants, onApprove, onDeny }) => {
  if (warrants.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-gray-800/80 p-6 rounded-lg shadow-2xl border border-gray-700 mt-12">
      <h2 className="gta-font text-2xl text-white text-center mb-6">Pending Warrants for Approval</h2>
      <ul className="space-y-4">
        {warrants.map((warrant, index) => (
          <li 
            key={`${warrant.name}-${index}`}
            className="bg-gray-900/50 p-4 rounded-md border border-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4 animate-fade-in"
          >
            <div>
              <p className="font-bold text-lg text-white">{warrant.name}</p>
              <p className="text-sm text-gray-300 capitalize italic">"{warrant.crime}"</p>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <button
                onClick={() => onApprove(index)}
                className="gta-font bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 active:bg-green-800 transition-colors duration-200"
              >
                Approve
              </button>
              <button
                onClick={() => onDeny(index)}
                className="gta-font bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 active:bg-red-800 transition-colors duration-200"
              >
                Deny
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApprovalQueue;
