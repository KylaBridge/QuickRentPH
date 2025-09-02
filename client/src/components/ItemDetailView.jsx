import { Fragment } from 'react';

const ItemDetailView = ({ item, onBack }) => {
  if (!item) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <button onClick={onBack} className="text-[#6C4BF4] text-sm mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Go Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Gallery */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-2">
            <div className="aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-contain" />
            </div>
            <div className="mt-3 flex items-center justify-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h2>
            <p className="text-xs text-gray-500 mb-3">Electronics and Gadgets</p>
            <p className="text-xl font-bold text-[#6C4BF4]">{item.price} / {item.period}</p>
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p><span className="font-semibold">Brand:</span> Canon</p>
              <p><span className="font-semibold">Model:</span> EOS 90D</p>
              <p><span className="font-semibold">Megapixels:</span> 25.5 MP</p>
              <p><span className="font-semibold">Battery Life:</span> Approx. 1300 shots</p>
            </div>
            <button className="mt-4 w-full bg-[#6C4BF4] hover:bg-[#7857FD] text-white font-semibold rounded py-2">RENT</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Included Accessories</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>x Camera body</li>
              <li>x Lens with front & rear caps</li>
              <li>x Battery & charger</li>
              <li>x 64GB SD card</li>
              <li>x Neck strap</li>
              <li>x Camera bag</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Terms and Conditions</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>Minimum rental period: 3 days</li>
              <li>Late fee: ₱300/day</li>
              <li>No international travel with the item</li>
              <li>Government ID required upon pickup</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Review and Ratings</h3>
            <div className="text-sm text-gray-700 space-y-3">
              <p>Great camera set in pristine condition and perfect for events.</p>
              <p>The image quality was stunning and battery lasted long.</p>
              <p>Perfect for vlogging. Clear 4k video, great autofocus.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4 text-xs text-gray-600">
          <h4 className="font-semibold mb-2">Booking Details</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li>Downpayment Required: 50% of rental fee + full deposit</li>
            <li>Payment Methods: GCash, PayMaya, Bank Transfer</li>
            <li>Pickup Location: Quezon City, near Trinoma Mall</li>
            <li>Delivery Option: Available within Metro Manila</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;


