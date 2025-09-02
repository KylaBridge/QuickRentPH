import React from 'react';
import { useNavigate } from 'react-router-dom';

const ItemList = ({ items, title = "Featured Items", showSeeMore = true, maxItems = 6, showActions = false, onView, onRent, compact = false, onCardClick }) => {

  const navigate = useNavigate();

  // Sample data
  const sampleItems = [
    {
      id: 1,
      renter: "John Doe",
      location: "Makati City",
      title: "DSLR Camera",
      price: "P 300",
      period: "day",
      rating: 5,
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      timeAgo: "2 days ago",
      category: "Electronics"
    },
    {
      id: 2,
      renter: "Jane Doe",
      location: "Pasig City",
      title: "Extension Cord",
      price: "P 50",
      period: "day",
      rating: 5,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      timeAgo: "3 days ago",
      category: "Tools"
    },
    {
      id: 3,
      renter: "Albert Einstein",
      location: "Marikina City",
      title: "Hard Drive",
      price: "P 75",
      period: "day",
      rating: 5,
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      timeAgo: "5 days ago",
      category: "Electronics"
    },
    {
      id: 4,
      renter: "Rajih Mendoza",
      location: "Pasay City",
      title: "HP Laptop",
      price: "P 300",
      period: "day",
      rating: 5,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      timeAgo: "2 days ago",
      category: "Electronics"
    },
    {
      id: 5,
      renter: "Judenn Mascarenas",
      location: "Quezon City",
      title: "Powerbank",
      price: "P 150",
      period: "day",
      rating: 5,
      image: "https://images.unsplash.com/photo-1609592807909-0d0a5a0b0a0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      timeAgo: "10 days ago",
      category: "Electronics"
    },
    {
      id: 6,
      renter: "Patrick Aldwin",
      location: "Bulacan City",
      title: "Pink Jisulife Fan",
      price: "P 100",
      period: "day",
      rating: 5,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      timeAgo: "8 days ago",
      category: "Electronics"
    }
  ];

  const displayItems = items || sampleItems.slice(0, maxItems);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  const gridClasses = compact
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3'
    : 'grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6';

  const cardClasses = compact
    ? 'bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 max-w-[200px] mx-auto cursor-pointer'
    : 'bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 max-w-xs mx-auto cursor-pointer';

  const imageWrapper = compact ? 'aspect-square p-2' : 'aspect-[4/3] p-2 sm:p-3';
  const titleClasses = compact ? 'text-xs font-semibold' : 'text-sm sm:text-base font-semibold';
  const priceClasses = compact ? 'text-sm font-bold' : 'text-sm sm:text-base font-bold';
  const actionPadding = compact ? 'px-2 py-1 text-xs' : 'px-3 py-2 text-xs sm:text-sm';

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-4">
      <div className="w-full max-w-7xl mx-auto">
        {/* Section Header */}
        {title !== '' && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-poppins">
              {title}
            </h2>
            {showSeeMore && (
              <button 
                onClick={() => navigate('/login')}
                className="text-[#6C4BF4] hover:text-purple-700 font-medium font-poppins"
              >
                See More
              </button>
            )}
          </div>
        )}

        {/* Items Grid */}
        <div className={gridClasses}>
          {displayItems.map((item) => (
            <div key={item.id} className={cardClasses} onClick={() => onCardClick && onCardClick(item)}>
              {/* Renter and Location */}
              <div className="px-2 sm:px-3 py-2 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] sm:text-xs font-medium text-gray-900 font-poppins">
                    {item.renter}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 font-poppins">
                    {item.location}
                  </span>
                </div>
              </div>

              {/* Item Image */}
              <div className={`${imageWrapper} bg-gray-100 flex items-center justify-center`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>

              {/* Item Details */}
              <div className="px-2 sm:px-3 py-2">
                <h3 className={`${titleClasses} text-gray-900 mb-1 font-poppins`}>
                  {item.title}
                </h3>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className={`${priceClasses} text-[#6C4BF4] font-poppins`}>
                    {item.price} / {item.period}
                  </span>
                </div>
                <div className="flex items-center mb-1.5 sm:mb-2">
                  <div className="flex items-center space-x-0.5 sm:space-x-1">
                    {renderStars(item.rating)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs text-gray-500 font-poppins">
                    {item.timeAgo}
                  </span>
                  <button className="text-gray-400 hover:text-red-500 transition-colors" onClick={(e) => e.stopPropagation()}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>

                {showActions && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); onView ? onView(item) : null; }}
                      className={`bg-white border border-gray-300 rounded ${actionPadding} font-medium hover:bg-gray-50`}
                    >
                      VIEW
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onRent ? onRent(item) : null; }}
                      className={`bg-[#6C4BF4] text-white rounded ${actionPadding} font-medium hover:bg-[#7857FD]`}
                    >
                      RENT
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItemList;
