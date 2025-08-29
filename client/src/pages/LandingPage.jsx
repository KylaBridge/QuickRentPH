import React from 'react';
// import './styles/LandingPage.css'; //this is for custom styles if needed

const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header Section */}
      <header className="w-full bg-[#6C4BF4] px-4 sm:px-6 lg:px-8 py-4">
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
            <button className="text-white border border-white px-4 py-2 rounded-md hover:bg-white hover:text-purple-600 transition-colors font-medium">
              SIGN UP
            </button>
            <button className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-colors font-medium">
              LOGIN
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#6C4BF4] leading-tight font-poppins">
                Rent What You Need,<br />
                When You Need It
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-2xl font-poppins">
                QuickRent connects people with items for rent to those who need them, 
                making access easy, secure, and affordable.
              </p>
              <button className="bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-md text-base sm:text-lg font-semibold hover:bg-purple-700 transition-colors font-poppins">
                GET STARTED
              </button>
            </div>

            {/* Right Side - Image Collage */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 p-6 sm:p-8 bg-gray-50 rounded-lg max-w-md lg:max-w-lg">
                {/* Items arranged in a more compact grid */}
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🚲</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🎧</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🎸</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🎵</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🎾</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">⚽</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🏈</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-orange-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">⚾</span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-200 rounded-lg flex items-center justify-center">
                    <span className="text-xl sm:text-2xl">🏓</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
        <div className="w-full max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="flex mb-6">
            <div className="flex-1 relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search items for rent"
                className="w-full px-4 py-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-poppins"
              />
              <button className="absolute right-0 top-0 h-full bg-purple-600 text-white px-4 rounded-r-md hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins">
              <span>Categories</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins">
              <span>Sort</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins">
              <span>Price</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins">
              <span>Deal Option</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins">
              <span>Location</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base font-poppins">
              <span>Condition</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
