
import React from 'react';
import ItemList from '../components/ItemList';

const Home: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome to the Homepage</h1>
      <ItemList />
    </div>
  );
};

export default Home;
