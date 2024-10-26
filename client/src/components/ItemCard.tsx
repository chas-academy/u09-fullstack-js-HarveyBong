import React, { useState } from "react";
import axios from "axios";

interface ItemProps {
  itemId: string;
  title: string;
  isFollowed: boolean; // Kolla om annonsen redan är följd
}

const ItemCard: React.FC<ItemProps> = ({ itemId, title, isFollowed }) => {
  const [followed, setFollowed] = useState(isFollowed);

  const handleFollow = async () => {
    try {
      const response = await axios.put(`/followed/${itemId}`);
      setFollowed(!followed);
    } catch (error) {
      console.error("Error following item", error);
    }
  };

  return (
    <div className="p-4 border shadow-sm">
      <h2>{title}</h2>
      <button
        onClick={handleFollow}
        className={`text-sm ${followed ? "text-yellow-500" : "text-gray-500"}`}
      >
        {followed ? "★" : "☆"} Följ
      </button>
    </div>
  );
};

export default ItemCard;
