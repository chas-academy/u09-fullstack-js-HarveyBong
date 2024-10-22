import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FollowedItems: React.FC = () => {
  const [followedItems, setFollowedItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchFollowedItems = async () => {
      try {
        const response = await axios.get('/api/user/followed-items'); 
        setFollowedItems(response.data);
      } catch (error) {
        console.error('Error fetching followed items', error);
      }
    };
    fetchFollowedItems();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Följda Annonser</h1>
      {followedItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {followedItems.map(item => (
            <div key={item._id} className="p-4 border shadow-sm">
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Du följer inga annonser än.</p>
      )}
    </div>
  );
};

export default FollowedItems;