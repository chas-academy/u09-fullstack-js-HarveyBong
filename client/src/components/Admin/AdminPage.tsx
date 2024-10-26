import React, { useState } from 'react';

import UserManagement from './UserManagement';
/*
import ItemManagement from './ItemManagement';
import OfferManagement from './OfferManagement';
*/

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('users');

  const getTabButtonClasses = (tabName: string) =>
    `w-full text-left p-4 rounded-md shadow-sm transition duration-300 ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 hover:bg-gray-300'
    }`;

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-3/4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="space-y-4 flex flex-col md:flex-row">
          <button
            onClick={() => setActiveTab('users')}
            className={getTabButtonClasses('users')}
          >
            Användarhantering
          </button>
          <button
            onClick={() => setActiveTab('items')}
            className={getTabButtonClasses('items')}
          >
            Annons- och produktöversikt
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={getTabButtonClasses('offers')}
          >
            Offertöversikt
          </button>
        </div>

        <div className="mt-6">
          {activeTab === 'users' && <UserManagement />}
         
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
