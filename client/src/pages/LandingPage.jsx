import React, { useState } from 'react';
import landingHeroImg from '../assets/landingHeroImg.png';
import SearchFilterSection from '../components/SearchFilterSection';
import ItemList from '../components/ItemList';
import Footer from '../components/Footer';
// import './styles/LandingPage.css'; //this is for custom styles if needed

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({});

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    console.log('Filters changed:', newFilters);
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Section */}
      <header className="w-full bg-[#6C4BF4] px-5 sm:px-6 lg:px-8 py-4 sticky top-0 z-50">
        <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/quickRentLogo.svg" 
              alt="Quick Rent Logo" 
              className="w-8 h-8"
            />
            <span className="text-white text-xl font-semibold font-poppins">Quick Rent</span>
          </div>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-white border border-white px-4 py-2 rounded-md bg-transparent hover:bg-white hover:text-purple-600 transition-colors font-medium">
              SIGN UP
            </button>
            <button className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium">
              LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-17 sm:px-12 lg:px-17 xl:px-20 py-12 lg:py-16">
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-10">
                <h1 className="text-5xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold text-[#6C4BF4] leading-tight font-poppins">
                Rent What You Need,
               <br />When You   Need It
              </h1>
              <p className="text-base sm:text-lg lg:text-lg xl:text-2xl text-gray-700 leading-relaxed max-w-2xl font-poppins">
                QuickRent connects people with items for rent to those who need them, 
                making access easy, secure, and affordable.
              </p>
              <button className="bg-[#6C4BF4] text-white px-6 sm:px-10 py-4 sm:py-5 rounded-md text-lg sm:text-xl font-semibold hover:bg-purple-700 transition-colors font-poppins">
                GET STARTED
              </button>
            </div>

            {/* Right Side - Hero Image */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="w-full max-w-md lg:max-w-lg">
                <img 
                  src={landingHeroImg} 
                  alt="items for rent" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="w-full max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="flex mb-6">
            <div className="flex-1 relative max-w-4xl mx-auto">
              <input
                type="text"
                placeholder="Search items for rent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-[#616161] rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4] focus:border-transparent font-poppins placeholder-[#616161] text-gray-900"
              />
              <button className="absolute right-0 top-0 h-full bg-[#6C4BF4] text-white px-4 rounded-r-md hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <SearchFilterSection onFilterChange={handleFilterChange} />

      {/* Featured Items Section */}
      <ItemList title="Featured Items" showSeeMore={true} maxItems={6} />

      {/* How It Works Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="w-full max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-16 font-poppins">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6C4BF4] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
                Post Your Item
              </h3>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Have something others might need temporarily? List it on QuickRent with photos, details, and your rental price. You control availability and terms.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6C4BF4] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
                Find What You Need
              </h3>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Browse by category, search by keyword, or filter by location to discover items available for rent near you.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6C4BF4] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
                Book the Rental
              </h3>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Select your preferred dates, confirm availability, and send a rental request to the item owner.
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#6C4BF4] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 font-poppins">
                Deal & Payment
              </h3>
              <p className="text-gray-700 leading-relaxed font-poppins">
                Finalize the rental through in-app messaging and choose a secure payment method-ensuring a smooth and safe transaction for both parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
