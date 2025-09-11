const RemovedTab = ({ removedItems, onRestoreItem, paginate, pageNumbers, currentPage, totalPages }) => (
    <div className="flex-1 flex flex-col">
        {removedItems.length > 0 ? (
            <div className="flex-1 flex flex-col">
                <div className="overflow-x-auto overflow-y-auto">
                    {/* Table Header */}
                    <div className="grid grid-cols-5 gap-4 p-4 font-semibold text-white bg-[#6C4BF4] rounded-lg shadow-sm">
                        <div className="col-span-1.5 text-center">Item</div>
                        <div className="col-span-1.5 text-center">Model</div>
                        <div className="ccol-span-1.5 text-center">Category</div>
                        <div className="col-span-1.5 text-center">Price per Day</div>
                        <div className="col-span-1.5 text-center">Actions</div>
                    </div>

                    {/* Table Body */}
                    {removedItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-5 gap-4 items-center px-4 py-3.5 mt-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-150">
                            <div className="col-span-1.5 flex justify-center">
                                <img src={item.image} alt={item.item} className="w-12 h-12 rounded-lg object-cover" />
                            </div>
                            <div className="col-span-1.5 text-center">
                                <p className="col-span-1.5 text-center font-medium text-gray-900">{item.item}</p>
                                <p className="col-span-1.5 text-center text-sm text-gray-500">{item.model}</p>
                            </div>
                            <div className="col-span-1.5 text-center text-black">{item.category}</div>
                            <div className="col-span-1.5 text-center text-black">
                                {`₱${parseFloat(item.price.replace(/[^0-9.]/g, '')).toFixed(2)}`}
                            </div>
                            <div className="col-span-1.5 text-center flex justify-center space-x-4">
                                <button
                                    onClick={() => onRestoreItem(item.id)}
                                    className="col-span-1.5 text-center flex flex-col items-center group"
                                    style={{ minWidth: '48px' }}
                                >
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="#6C4BF4" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M7 9a7 7 0 112.46 4.96"></path>
                                    </svg>
                                    <span className="text-xs text-gray-500">Restore</span>
                                </button>
                                <button
                                    onClick={() => console.log('Delete Permanently', item.id)}
                                    className="col-span-1.5 text-center flex flex-col items-center group"
                                    style={{ minWidth: '48px' }}
                                >
                                    <svg className="w-5 h-5 mb-1" fill="none" stroke="#6C4BF4" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    <span className="text-xs text-gray-500">Delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Pagination UI */}
                <div className="sticky bottom-0 left-0 z-10 flex justify-center items-center space-x-2 mt-auto pt-4">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
                    >
                        Previous
                    </button>
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors duration-200 ${
                                currentPage === number ? 'bg-[#6C4BF4] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {number}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
                    >
                        Next
                    </button>
                </div>
            </div>
        ) : (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-lg">You have no removed items.</p>
            </div>
        )}
    </div>
);

export default RemovedTab;
