import { useState, useRef } from 'react';

const REVIEWS_PER_PAGE = 3;

const ItemDetailView = ({ item, onBack }) => {
  if (!item) return null;

  // Defensive: fallback to empty arrays if fields are missing
  const images = item.images && item.images.length > 0 ? item.images : [item.image].filter(Boolean);
  const specifications = item.specifications || [];
  const accessories = item.accessories || [];
  const terms = item.terms || [];
  const reviews = item.reviews || [];
  const bookingDetails = item.bookingDetails || [];

  // Image carousel state
  const [currentImage, setCurrentImage] = useState(0);
  const autoSlideRef = useRef();

  // Reviews pagination state
  const [reviewPage, setReviewPage] = useState(0);
  const totalReviewPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  // Carousel handlers
  const goToPrev = () => setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const goToNext = () => setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Auto-slide on hover
  const startAutoSlide = (direction) => {
    stopAutoSlide();
    autoSlideRef.current = setInterval(() => {
      direction === 'next' ? goToNext() : goToPrev();
    }, 300);
  };
  const stopAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  };

  // Review pagination handlers
  const handlePrevReviewPage = () => setReviewPage((prev) => Math.max(prev - 1, 0));
  const handleNextReviewPage = () => setReviewPage((prev) => Math.min(prev + 1, totalReviewPages - 1));

  const pagedReviews = reviews.slice(
    reviewPage * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE + REVIEWS_PER_PAGE
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        {/* Sticky Go Back Button */}
        <div className="sticky top-0 z-20 bg-gray-50 pt-2 pb-2">
          <button
            onClick={onBack}
            className="text-[#6C4BF4] text-sm flex items-center gap-2 bg-white px-3 py-1 rounded shadow hover:bg-gray-50"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Go Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          {/* Image Gallery Panel */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 lg:col-span-2 flex flex-col">
            <div className="relative aspect-video bg-gray-100 rounded flex items-center justify-center overflow-hidden">
              <img
                src={images[currentImage]}
                alt={item.title}
                className="w-full h-full object-contain transition-all duration-200"
              />
              {/* Prev Button */}
              {images.length > 1 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
                  onClick={goToPrev}
                  onMouseEnter={() => startAutoSlide('prev')}
                  onMouseLeave={stopAutoSlide}
                  tabIndex={0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              {/* Next Button */}
              {images.length > 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow"
                  onClick={goToNext}
                  onMouseEnter={() => startAutoSlide('next')}
                  onMouseLeave={stopAutoSlide}
                  tabIndex={0}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`w-10 h-10 rounded border-2 ${currentImage === idx ? 'border-[#6C4BF4]' : 'border-gray-200'} overflow-hidden`}
                    onClick={() => setCurrentImage(idx)}
                  >
                    <img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col gap-2">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h2>
            <p className="text-xs text-gray-500 mb-2">{item.category}</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-2xl font-bold text-[#6C4BF4]">{item.price}</span>
              <span className="text-sm text-gray-500">/ {item.period}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-yellow-400 font-bold">{'★'.repeat(Math.round(item.rating || 0))}</span>
              <span className="text-xs text-gray-500">({item.ratingCount || 0} reviews)</span>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Brand:</span> {item.brand}
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Model:</span> {item.model}
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Specifications:</span>
              <ul className="list-disc pl-5">
                {specifications.map((spec, idx) => (
                  <li key={idx}>{spec}</li>
                ))}
              </ul>
            </div>
            <div className="text-sm text-gray-700 mb-2">
              <span className="font-semibold">Availability:</span> {item.availability}
            </div>
            <button className="mt-2 w-full bg-[#6C4BF4] hover:bg-[#7857FD] text-white font-semibold rounded py-2">
              RENT NOW
            </button>
          </div>
        </div>

        {/* Accessories, Terms, Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Included Accessories */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Included Accessories</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              {accessories.map((acc, idx) => (
                <li key={idx}>{acc}</li>
              ))}
            </ul>
          </div>
          {/* Terms and Conditions */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Terms and Conditions</h3>
            <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
              {terms.map((term, idx) => (
                <li key={idx}>{term}</li>
              ))}
            </ul>
          </div>
          {/* Reviews with Pagination */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col">
            <h3 className="font-semibold mb-2">Reviews & Ratings</h3>
            <div className="text-sm text-gray-700 space-y-3 flex-1">
              {pagedReviews.map((review, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-2 mb-2 last:border-b-0 last:pb-0 last:mb-0">
                  <div className="font-semibold text-gray-800">{review.user}</div>
                  <div className="text-xs text-yellow-400">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <div>{review.comment}</div>
                </div>
              ))}
              {reviews.length === 0 && <div className="text-gray-400 italic">No reviews yet.</div>}
            </div>
            {/* Pagination Controls */}
            {totalReviewPages > 1 && (
              <div className="flex justify-end items-center gap-2 mt-2">
                <button
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                  onClick={handlePrevReviewPage}
                  disabled={reviewPage === 0}
                >
                  Prev
                </button>
                <span className="text-xs text-gray-500">
                  Page {reviewPage + 1} of {totalReviewPages}
                </span>
                <button
                  className="px-2 py-1 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                  onClick={handleNextReviewPage}
                  disabled={reviewPage === totalReviewPages - 1}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4 text-xs text-gray-600">
          <h4 className="font-semibold mb-2">Booking Details</h4>
          <ul className="list-disc pl-5 space-y-1">
            {bookingDetails.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailView;


