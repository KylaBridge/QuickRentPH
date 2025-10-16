import Pagination from "../Pagination";
import {
  quickRateCalculation,
  formatCurrency,
} from "../../utils/rentalCalculations";

const RemovedTab = ({
  removedItems,
  onRestoreItem,
  pagination,
  // Legacy props for backward compatibility - can be removed later
  paginate,
  pageNumbers,
  currentPage,
  totalPages,
}) => (
  <div className="flex-1 flex flex-col -mt-6">
    {removedItems.length > 0 ? (
      <div className="flex-1 flex flex-col">
        <div className="mt-4 overflow-x-auto overflow-y-auto pr-4">
          {/* Table Header */}
          <div className="grid grid-cols-5 text-sm gap-4 pt-4 pb-4 pl-2 pr-7 font-semibold text-white bg-[#6C4BF4] rounded-lg shadow-sm">
            <div className="col-span-1.5 text-center">Item</div>
            <div className="col-span-1.5 text-center">Model</div>
            <div className="ccol-span-1.5 text-center">Category</div>
            <div className="col-span-1.5 text-center">Price per Day</div>
            <div className="col-span-1.5 text-center">Actions</div>
          </div>

          {/* Table Body */}
          {removedItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-5 gap-4 items-center pl-2 pr-4 pt-2 pb-2 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors duration-150"
            >
              <div className="col-span-1.5 flex justify-center">
                <img
                  src={item.image}
                  alt={item.item}
                  className="w-8.5 h-8.5 rounded-lg object-cover"
                />
              </div>
              <div className="col-span-1.5 text-center">
                <p className="col-span-1.5 text-sm text-center font-medium text-gray-900">
                  {item.item}
                </p>
                {/*<p className="col-span-1.5 text-center text-sm text-gray-500">{item.model}</p>*/}
              </div>
              <div className="col-span-1.5 text-sm text-center text-black">
                {item.category}
              </div>
              <div className="col-span-1.5 text-sm text-center text-black">
                {(() => {
                  const priceStr = item.price.toString();
                  const basePrice =
                    parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
                  const finalPrice = quickRateCalculation(basePrice).finalRate;
                  return formatCurrency(finalPrice, true);
                })()}
              </div>
              <div className="col-span-1.5 text-center flex justify-center space-x-4">
                <button
                  onClick={() => onRestoreItem(item.id)}
                  className="col-span-1.5 text-sm text-center flex flex-col items-center group"
                  style={{ minWidth: "48px" }}
                >
                  <svg
                    className="w-5 h-5 mb-1 mt-1"
                    fill="none"
                    stroke="#6C4BF4"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h5M7 9a7 7 0 112.46 4.96"
                    ></path>
                  </svg>
                  <span className="text-xs text-gray-500">Restore</span>
                </button>
                <button
                  onClick={() => console.log("Delete Permanently", item.id)}
                  className="col-span-1.5 text-sm text-center flex flex-col items-center group"
                  style={{ minWidth: "48px" }}
                >
                  <svg
                    className="w-5 h-5 mb-2"
                    fill="none"
                    stroke="#6C4BF4"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  <span className="text-xs text-gray-500">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={pagination?.currentPage || currentPage}
          totalPages={pagination?.totalPages || totalPages}
          totalItems={pagination?.totalItems}
          startIndex={pagination?.startIndex}
          endIndex={pagination?.endIndex}
          onPageChange={pagination?.goToPage || paginate}
          itemName="removed items"
          maxVisiblePages={5}
        />
      </div>
    ) : (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 text-lg">You have no removed items.</p>
      </div>
    )}
  </div>
);

export default RemovedTab;
