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
                return 'text-green-600';
            case 'Pending':
                return 'text-orange-600';
            case 'In Escrow':
                return 'text-blue-600';
            default:
                return 'text-gray-800';
        }
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="-mt-4 -mb-1 pr-4 flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
        
            </div>

            {/* Earnings Table */}
            <div className="mt-3 overflow-x-auto overflow-y-auto pr-4">
                {/* Table Header */}
                <div className="grid grid-cols-8 text-sm gap-4 pt-4 pb-4 pl-2 pr-7 font-semibold text-white bg-[#6C4BF4] rounded-lg shadow-sm">
                    <div className="col-span-1 text-center">Transaction ID</div>
                    <div className="col-span-1 text-center">Item Model</div>
                    <div className="col-span-1 text-center">Rental Date</div>
                    <div className="col-span-1 text-center">Payment</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">Held in Escrow</div>
                    <div className="col-span-1 text-center">Total Earned</div>
                    <div className="col-span-1.5 text-center">Action</div>
                </div>

                {/* Table Body */}
                {currentEarnings.map((earning) => (
                    <div key={earning.id} className="grid grid-cols-8 gap-4 items-center pl-2 pr-4 pt-4 pb-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-150">
                        <div className="col-span-1 text-center text-sm font-medium text-gray-600">{earning.transactionId}</div>
                        <div className="col-span-1 text-center">
                            <p className="font-medium text-sm text-gray-900">{earning.item}</p>
                            {/*<p className="text-sm text-gray-500">{earning.model}</p>*/}
                        </div>
                        <div className="col-span-1 text-center text-sm text-gray-800">{earning.rentalDate}</div>
                        <div className="col-span-1 text-center text-sm text-gray-800">{`₱${parseFloat(earning.payment).toFixed(2)}`}</div>
                        <div className="col-span-1 text-center">
                            <span className={`text-sm text-center ${getStatusClass(earning.status)}`}>
                                {earning.status}
                            </span>
                        </div>
                        <div className="col-span-1 text-center text-sm text-gray-800">{`₱${parseFloat(earning.escrow).toFixed(2)}`}</div>
                        <div className="col-span-1 text-center text-sm text-black">{`₱${parseFloat(earning.totalEarned).toFixed(2)}`}</div>
                        <div className="col-span-1.5 flex justify-center pr-8">
                            <button
                                onClick={() => console.log('View Receipt', earning.transactionId)}
                                className="flex items-center gap-1 text-sm text-[#6C4BF4] hover:text-[#5a3fd0] font-medium whitespace-nowrap"
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
            <div className="sticky left-0 z-10 flex justify-center items-center space-x-2"
                 style={{ marginTop: 'auto', marginBottom: '-15px' }}>
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-xs text-gray-700 bg-gray-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
                >
                    Previous
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 text-xs rounded-lg shadow-sm font-semibold transition-colors duration-200 ${
                            currentPage === number ? 'bg-[#6C4BF4] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-xs text-gray-700 bg-gray-200 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors duration-200"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EarningsTab;
