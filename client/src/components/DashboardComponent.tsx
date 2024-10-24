import React from 'react';
import FollowedItems from './FollowedItems';

const Dashboard: React.FC = () => {
  return (
    
    <div className="flex justify-center items-center h-screen">
      <div className="w-80">
        <h1 className="text-3xl font-bold mb-6">Konto</h1>
        <div className="space-y-4">
          <button className="w-full text-left bg-gray-200 p-4 rounded-md shadow-sm hover:bg-gray-300 transition duration-300">
            Följer
          </button>
          <button className="w-full text-left bg-gray-200 p-4 rounded-md shadow-sm hover:bg-gray-300 transition duration-300">
            Dina Annonser
          </button>
          <button className="w-full text-left bg-gray-200 p-4 rounded-md shadow-sm hover:bg-gray-300 transition duration-300">
            Skickade Hälsningar
          </button>
          <button className="w-full text-left bg-gray-200 p-4 rounded-md shadow-sm hover:bg-gray-300 transition duration-300">
            Inställningar
          </button>
          <FollowedItems />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
