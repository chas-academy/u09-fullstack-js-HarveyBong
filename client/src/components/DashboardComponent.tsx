import React, { useState } from 'react';
import FollowedItems from './FollowedItems';
import UserAds from './UserAds';

import UserSettings from './UserSettings';
import OffersInbox from './OffersInbox';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(''); 
 

  

  const getTabButtonClasses = (tabName: string) =>
    `w-full text-left px-4 py-3 font-semibold rounded-lg shadow-md transition duration-300 ${
      activeTab === tabName
        ? 'bg-greenish-gray text-white opacity-70 hover:opacity-100'
        : 'bg-light-beige text-dark-black hover:bg-greenish-gray hover:text-white'
    }`;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-20 px-5">
      <div className="w-full max-w-lg p-8 space-y-6 bg-dark-gray rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-light-beige mb-6">Konto</h1>
        <div className="space-y-4">
          <button
            onClick={() => setActiveTab('followed')}
            className={getTabButtonClasses('followed')}
          >
            Följer
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={getTabButtonClasses('ads')}
          >
            Dina Annonser
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={getTabButtonClasses('messages')}
          >
            Mottagna Offerter
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={getTabButtonClasses('settings')}
          >
            Inställningar
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'followed' && <FollowedItems />}
          {activeTab === 'ads' && <UserAds />}
          {activeTab === 'messages' && <OffersInbox />}
          {activeTab === 'settings' && <UserSettings />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
