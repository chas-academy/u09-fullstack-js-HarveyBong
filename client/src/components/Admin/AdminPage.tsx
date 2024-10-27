import React, { useState } from 'react';
import UserManagement from './UserManagement';
import ItemManagement from './ItemManagement';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('users');

  const getTabButtonClasses = (tabName: string) =>
    `w-full md:w-auto text-left p-4 rounded-md shadow-sm transition-all ${
      activeTab === tabName
        ? 'bg-blue-500 text-white'
        : 'bg-gray-200 hover:bg-gray-300'
    }`;

  return (
    <div className="flex flex-col items-center min-h-screen p-4 md:p-10 bg-gray-100">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Admin Dashboard
        </h1>
        
        {/* tabs for navigation */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
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
        </div>

        {/* Content based on active tab */}
        <div className="bg-white p-4 md:p-6 rounded-md shadow-md">
          {activeTab === 'users' && (
            <div className="overflow-auto max-h-[70vh]">
              <UserManagement />
            </div>
          )}
          {activeTab === 'items' && (
            <div className="overflow-auto max-h-[70vh]">
              <ItemManagement />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
