import React, { useState } from 'react';
import FollowedItems from './FollowedItems';
import UserAds from './UserAds';
import Item from '../interfaces/Item';
import { useNavigate } from 'react-router-dom';
import UserSettings from './UserSettings';
import OffersInbox from './OffersInbox';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>(''); 
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const navigate = useNavigate();
  const handleItemClick = (item: Item) => {
    console.log(`Item clicked with ID: ${item._id}`); 
    if (window.innerWidth <= 768) {
      navigate(`/items/${item._id}`); 
    } else {
      setSelectedItem(item); 
    }
  };
  
  const getTabButtonClasses = (tabName: string) =>
    `w-full text-left p-4 rounded-md shadow-sm transition duration-300 ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 hover:bg-gray-300'
    }`;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-80">
        <h1 className="text-3xl font-bold mb-6">Konto</h1>
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
