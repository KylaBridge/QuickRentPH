const ItemsTab = ({
    currentItems,
    rowDropdown,
    handleRowDropdownToggle,
    handleRowSelect,
    CustomDropdown,
    openDropdown,
    handleDropdownToggle,
    handleCategorySelect,
    handleAvailabilitySelect,
    handleStatusSelect,
    paginate,
    pageNumbers,
    currentPage,
    totalPages,
    onRemoveItem
}) => (
    <div className="flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0">
            {/* Dropdown filters using the new CustomDropdown component */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
                <CustomDropdown
                    label="Categories"
                    options={[
                        'Electronics and Gadgets', 'Home and Appliances', 'Events and Parties',
                        'Outdoor and Travel', 'Media and Hobbies', 'Clothing and Fashion',
                        'Vehicles and Transport', 'Equipment and Tools', 'Sports Essentials', 'Seasonal Item'
                    ]}
                    onSelect={handleCategorySelect}
                    isOpen={openDropdown === 'Categories'}
                    onToggle={() => handleDropdownToggle('Categories')}
                />
                <CustomDropdown
                    label="Availability"
                    options={['Available', 'Unavailable', 'Rented Out']}
                    onSelect={handleAvailabilitySelect}
                    isOpen={openDropdown === 'Availability'}
                    onToggle={() => handleDropdownToggle('Availability')}
                />
                <CustomDropdown
                    label="Status"
                    options={['Active', 'Inactive']}
                    onSelect={handleStatusSelect}
                    isOpen={openDropdown === 'Status'}
                    onToggle={() => handleDropdownToggle('Status')}
                />
            </div>
            {/* Add an Item button on the right */}
            <button className="bg-[#6C4BF4] text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:bg-[#3200FF] active:bg-[#5f46c6] transition-colors duration-200 w-full md:w-auto flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/>
                </svg>
                <span>Add an Item</span>
            </button>
        </div>

        {/* Items Table */}
        <div className="mt-8 overflow-x-auto overflow-y-auto">
            <div className="grid grid-cols-7 gap-4 p-4 font-semibold text-white  bg-[#6C4BF4] rounded-lg shadow-sm">
                <div className="col-span-1">Item</div>
                <div className="col-span-1">Model</div>
                <div className="col-span-1">Category</div>
                <div className="col-span-1">Price per Day</div>
                <div className="col-span-1">Availability</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-center">Actions</div>
            </div>

            {currentItems.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-7 gap-4 items-center p-4 mt-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-150">
                    <div className="col-span-1">
                        <img src={item.image} alt={item.item} className="w-12 h-12 rounded-lg object-cover" />
                    </div>
                    <div className="col-span-1">
                        <p className="font-medium">{item.item}</p>
                        <p className="text-sm text-gray-500">{item.model}</p>
                    </div>
                    <div className="col-span-1 text-black">{item.category}</div>
                    <div className="col-span-1 text-black">
                        {`₱${parseFloat(item.price.replace(/[^0-9.]/g, '')).toFixed(2)}`}
                    </div>
                    {/* Availability Dropdown */}
                    <div className="col-span-1">
                        <div className="relative w-35">
                            <button
                                onClick={() => handleRowDropdownToggle(item.id, 'availability')}
                                className="px-4 py-2 text-sm w-full flex items-center justify-center font-normal text-black bg-transparent border border-gray-300 shadow-sm rounded-lg"
                            >
                                <span className="flex items-center justify-center gap-2 w-full">
                                    <span>{item.availability}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${rowDropdown[`${item.id}-availability`] ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </span>
                            </button>
                            {rowDropdown[`${item.id}-availability`] && (
                                <div
                                    className={`absolute z-10 left-0 ${idx >= currentItems.length - 2 ? 'bottom-full mb-2' : 'mt-1'} shadow-md rounded-lg bg-white border border-gray-300`}
                                    style={{ width: '100%' }}
                                >
                                    {['Available', 'Unavailable', 'Rented Out'].map(option => (
                                        <div
                                            key={option}
                                            onClick={() => handleRowSelect(item.id, 'availability', option)}
                                            style={{
                                                color: 'black',
                                                fontWeight: 'normal',
                                                padding: '0.5rem 0',
                                                textAlign: 'center',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Status Dropdown */}
                    <div className="col-span-1">
                        <div className="relative w-28">
                            <button
                                onClick={() => handleRowDropdownToggle(item.id, 'status')}
                                className="px-4 py-2 text-sm w-full flex items-center justify-center font-normal text-black bg-transparent border border-gray-300 shadow-sm rounded-lg"
                            >
                                <span className="flex items-center justify-center gap-2 w-full">
                                    <span>{item.status}</span>
                                    <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${rowDropdown[`${item.id}-status`] ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </span>
                            </button>
                            {rowDropdown[`${item.id}-status`] && (
                                <div
                                    className={`absolute z-10 left-0 ${idx === currentItems.length - 1 ? 'bottom-full mb-2' : 'mt-1'} shadow-md rounded-lg bg-white border border-gray-300`}
                                    style={{ width: '100%' }}
                                >
                                    {['Active', 'Inactive'].map(option => (
                                        <div
                                            key={option}
                                            onClick={() => handleRowSelect(item.id, 'status', option)}
                                            style={{
                                                color: 'black',
                                                fontWeight: 'normal',
                                                padding: '0.5rem 0',
                                                textAlign: 'center',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-1 flex justify-center space-x-4">
                        <button
                            onClick={() => console.log('Edit', item.id)}
                            className="flex flex-col items-center group"
                            style={{ minWidth: '48px' }}
                        >
                            <svg className="w-5 h-5 mb-1" fill="none" stroke="#6C4BF4" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                            </svg>
                            <span className="text-xs text-gray-500">Edit</span>
                        </button>
                        <button
                            onClick={() => console.log('View', item.id)}
                            className="flex flex-col items-center group"
                            style={{ minWidth: '48px' }}
                        >
                            <svg className="w-5 h-5 mb-1" fill="none" stroke="#6C4BF4" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <span className="text-xs text-gray-500">View</span>
                        </button>
                        <button
                            onClick={() => onRemoveItem(item.id)}
                            className="flex flex-col items-center group"
                            style={{ minWidth: '48px' }}
                        >
                            <svg className="w-5 h-5 mb-1" fill="none" stroke="#6C4BF4" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            <span className="text-xs text-gray-500">Remove</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>

        {/* Pagination UI */}
        <div className="sticky bottom-0 left-0 z-10 flex justify-center items-center space-x-2"
             style={{ marginTop: 'auto' }}>
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

export default ItemsTab;