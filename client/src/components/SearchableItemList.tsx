import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemDetails from "./ItemDetails";
import Item from "../interfaces/Item";
import { useNavigate } from "react-router-dom";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import toast from "react-hot-toast";


const SearchableItemList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [followedItems, setFollowedItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/items`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setItems(response.data);
          setFilteredItems(response.data);
        }
      } catch (error) {
        console.error("Error fetching items", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const fetchFollowedItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_RENDER_URL}/followed`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setFollowedItems(response.data);
        } else {
          console.error("Failed to fetch followed items", response.status);
        }
      } catch (err) {
        console.error("Error fetching followed items", err);
      }
    };
    fetchFollowedItems();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const handleFollow = async (itemId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_RENDER_URL}/follow/${itemId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        const followedItem = items.find((item) => item._id === itemId);
        if (followedItem) {
          setFollowedItems((prev) => [...prev, followedItem]);
        }
        toast.success("Produkt följs nu!");
      } else {
        console.error("Failed to follow item", response.status);
        toast.error("Misslyckades att följa produkten.");
      }
    } catch (err) {
      console.error("Error following item", err);
      toast.error("Misslyckades att följa produkten.");
    }
  };

  const handleUnfollow = async (itemId: string) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_RENDER_URL}/unfollow/${itemId}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setFollowedItems((prev) => prev.filter((item) => item._id !== itemId));
        toast.success("Produkt avföljd!");
      } else {
        console.error("Failed to unfollow item", response.status);
        toast.error("Misslyckades att avfölja produkten.");
      }
    } catch (err) {
      console.error("Error unfollowing item", err);
      toast.error("Misslyckades att avfölja produkten.");
    }
  };

  const handleItemClick = (item: Item) => {
    if (window.innerWidth <= 768) {
      navigate(`/items/${item._id}`);
    } else {
      setSelectedItem(null);
      setTimeout(() => setSelectedItem(item), 0);
    }
  };

  return (
    <div className="container mx-auto min-h-screen p-6">
      <input
        type="text"
        placeholder="Sök efter annonser..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 border border-gray-300 rounded w-full mb-6"
      />

      <div className="md:grid md:grid-cols-2 gap-4">
        <div
          className="md:col-span-1 space-y-4 overflow-y-auto md:my-20"
          style={{ maxHeight: "80vh" }}
        >
          {Array.isArray(filteredItems) ? (
            
            filteredItems.map((item) => (
              <div
                key={item._id}
                className="flex border p-4 rounded-lg shadow-md hover:shadow-lg cursor-pointer"
                onClick={() => handleItemClick(item)}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-md mr-4"
                  />
                )}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                    <h2 className="text-xl font-bold leading-5">{item.title}</h2>
                    <p>
                      {new Date(item.createdAt).toLocaleString("sv-SE", {
                        weekday: "short",
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          followedItems.some(
                            (followedItem) => followedItem._id === item._id
                          )
                        ) {
                          handleUnfollow(item._id);
                        } else {
                          handleFollow(item._id);
                        }
                      }}
                      className="ml-4"
                    >
                      {followedItems.some(
                        (followedItem) => followedItem._id === item._id
                      ) ? (
                        <AiFillStar className="text-yellow-500 text-3xl" />
                      ) : (
                        <AiOutlineStar className="text-gray-500 text-3xl" />
                      )}
                    </button>
                  </div>
                  <p>{item.createdBy?.name || "Okänd användare"}</p>
                  
                  <p className="text-lg font-semibold mt-2">
                    {item.price.toLocaleString()} kr
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Inga annonser matchade din sökning.
            </p>
          )}
        </div>

        {/* Högra kolumnen för större skärmar */}
        <div className="md:col-span-1">
          {window.innerWidth > 768 && selectedItem && (
            <ItemDetails item={selectedItem} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchableItemList;
