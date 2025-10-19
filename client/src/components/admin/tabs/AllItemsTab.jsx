import React, { useState, useEffect, useContext } from "react";
import ProductViewModal from "../ProductViewModal";
import {
  IoEye,
  IoCube,
  IoCheckmarkCircle,
  IoCloseCircle,
} from "react-icons/io5";
import { UserContext } from "../../../context/userContext";

const getStatusBadge = (status) => {
  const badges = {
    available: "bg-green-100 text-green-800",
    "rented out": "bg-gray-100 text-gray-800",
  };
  return badges[status] || "bg-gray-100 text-gray-800";
};

const getStatusIcon = (status) => {
  switch (status) {
    case "available":
      return <IoCheckmarkCircle className="w-4 h-4 text-green-600" />;
    case "rented out":
      return <IoCloseCircle className="w-4 h-4 text-gray-600" />;
    default:
      return null;
  }
};

const AllItemsTab = ({ searchTerm, onError, onStatusChange }) => {
  const { getAllItems } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [viewedItem, setViewedItem] = useState(null);

  useEffect(() => {
    // Dummy data for demonstration
    setTimeout(() => {
      setItems([
        {
          id: "itm1",
          name: "Canon EOS 80D DSLR Camera",
          owner: "John Doe",
          ownerId: "u1",
          category: "Cameras",
          price: 1200,
          status: "available",
          dateSubmitted: "2024-10-01",
          description: "A high-quality DSLR camera for photography.",
          specs: "24.2MP, Wi-Fi, Full HD",
          location: "Makati, Metro Manila",
          dealOption: "Meetup",
          rentedCount: 5,
        },
        {
          id: "itm2",
          name: "MacBook Pro 2021",
          owner: "Jane Smith",
          ownerId: "u2",
          category: "Laptops",
          price: 2500,
          status: "rented out",
          dateSubmitted: "2024-10-05",
          image: "/api/placeholder/80/80",
          description: "Apple M1 Pro, 16GB RAM, 512GB SSD.",
          location: "Quezon City, Metro Manila",
          dealOption: "Delivery",
        },
        {
          id: "itm3",
          name: "Electric Guitar Fender Stratocaster",
          owner: "Mike Johnson",
          ownerId: "u3",
          category: "Musical Instruments",
          price: 800,
          status: "available",
          dateSubmitted: "2024-09-28",
          image: "/api/placeholder/80/80",
          description: "Classic Fender Strat, sunburst finish.",
          specs: "Sunburst finish, maple neck",
          location: "Pasig, Metro Manila",
          dealOption: "Meetup",
          rentedCount: 2,
        },
        // ...existing items...
      ]);
      setLoading(false);
    }, 500);
  }, []);

  // Filter items based on searchTerm
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.owner.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.category.toLowerCase().includes(searchTerm?.toLowerCase() || "") ||
      item.location?.toLowerCase().includes(searchTerm?.toLowerCase() || "");
    return matchesSearch;
  });

  const handleViewItem = (item) => {
    setViewedItem(item);
  };

  const handleCloseModal = () => {
    setViewedItem(null);
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading items...</p>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <IoCube className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No items found
        </h3>
        <p className="text-gray-600 mb-4">
          {searchTerm
            ? "Try adjusting your search terms"
            : "No items have been submitted yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Owner
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Submitted
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredItems.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 font-medium text-gray-900">
                {item.name}
              </td>
              <td className="px-4 py-2 text-gray-900">{item.owner}</td>
              <td className="px-4 py-2 text-gray-900">{item.category}</td>
              <td className="px-4 py-2 text-gray-900">
                {item.location || "Not specified"}
              </td>
              <td className="px-4 py-2 text-gray-900">₱{item.price}/day</td>
              <td className="px-4 py-2 text-center align-middle">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap flex items-center justify-center ${getStatusBadge(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-2 text-gray-900">{item.dateSubmitted}</td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-600 hover:text-blue-900"
                  title="View Item"
                  onClick={() => handleViewItem(item)}
                >
                  <IoEye className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Item Details Modal */}
      <ProductViewModal
        item={viewedItem}
        onClose={handleCloseModal}
        onDelete={(item) => {
          // TODO: Implement delete logic
          alert(`Delete item ${item.name}`);
        }}
      />
    </div>
  );
};

export default AllItemsTab;
