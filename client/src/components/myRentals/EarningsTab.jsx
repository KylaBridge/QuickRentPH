const EarningsTab = ({
    currentEarnings,
    paginate,
    pageNumbers,
    currentPage,
    totalPages
}) => {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed':
                return 'text-center text-green-600';
            case 'Pending':
                return 'text-center text-orange-500';
            case 'In Escrow':
                return 'text-center text-blue-500';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            {/* Earnings Table */}
            <div className="overflow-x-auto overflow-y-auto">
                {/* Table Header */}
                <div className="grid grid-cols-8 gap-4 p-4 font-semibold text-white bg-[#6C4BF4] rounded-lg shadow-sm">
                    <div className="col-span-1.5 text-center">Transaction ID</div>
                    <div className="col-span-1.5 text-center">Item Model</div>
                    <div className="col-span-1.5 text-center">Rental Date</div>
                    <div className="col-span-1.5 text-center">Payment</div>
                    <div className="col-span-1.5 text-center">Status</div>
                    <div className="col-span-1.5 text-center">Held in Escrow</div>
                    <div className="col-span-1.5 text-center">Total Earned</div>
                    <div className="col-span-1.5 text-center">Action</div>
                </div>

                {/* Table Body */}
                {currentEarnings.map((earning) => (
                    <div key={earning.id} className="grid grid-cols-8 gap-4 items-center p-4 mt-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-150">
                        <div className="col-span-1.5 text-center font-medium text-gray-600">{earning.transactionId}</div>
                        <div className="col-span-1.5 text-center">
                            <p className="font-medium text-gray-900">{earning.item}</p>
                            <p className="text-sm text-gray-500">{earning.model}</p>
                        </div>
                        <div className="col-span-1.5 text-center text-gray-800">{earning.rentalDate}</div>
                        <div className="col-span-1.5 text-center text-gray-800">{`₱${parseFloat(earning.payment).toFixed(2)}`}</div>
                        <div className="col-span-1.5 text-center">
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusClass(earning.status)}`}>
                                {earning.status}
                            </span>
                        </div>
                        <div className="col-span-1.5 text-center text-gray-800 text-center">{`₱${parseFloat(earning.escrow).toFixed(2)}`}</div>
                        <div className="col-span-1.5 text-center font-sm text-black text-center">{`₱${parseFloat(earning.totalEarned).toFixed(2)}`}</div>
                        <div className="col-span-1.5 flex justify-center">
                            <button
                                onClick={() => console.log('View Receipt', earning.transactionId)}
                                className="flex items-center gap-1 text-sm text-[#6C4BF4] hover:text-[#5a3fd0] font-medium"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span>
                                    View Receipt
                                </span>
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
    );
};

export default EarningsTab;
