import { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import StatusTab from "../components/myRequests/StatusTab";
import PaymentsTab from "../components/myRequests/PaymentsTab";
import ReturnedTab from "../components/myRequests/ReturnedTab";
import { usePagination } from "../hooks/usePagination";
import { useRental } from "../context/rentalContext";

const MyRequests = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("status");

  const { getUserRentals } = useRental();
  const [statusRequests, setStatusRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState(null);

  const mockPayments = Array(20)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      transactionId: `TXN${i + 1}`,
      amount: `₱${(i + 1) * 100}`,
    }));

  const mockReturns = Array(30)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      itemName: `Returned Item ${i + 1}`,
      owner: `owner${i + 1}`,
      returnStatus: ["completed", "pending_confirmation"][i % 2],
    }));

  // Pagination setup - reduced items per page for better UX
  const statusPagination = usePagination(statusRequests, 4);
  const paymentsPagination = usePagination(mockPayments, 10);
  const returnsPagination = usePagination(mockReturns, 4);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const isMounted = useRef(true);

  const loadRequests = async () => {
    setLoadingRequests(true);
    setRequestsError(null);
    try {
      const resp = await getUserRentals();
      if (!isMounted.current) return;
      setStatusRequests(resp.rentals || []);
    } catch (err) {
      if (!isMounted.current) return;
      setRequestsError(
        err?.response?.data?.error || err.message || "Failed to load requests"
      );
    } finally {
      if (isMounted.current) setLoadingRequests(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    loadRequests();
    return () => {
      isMounted.current = false;
    };
  }, [getUserRentals]);

  const handleUpdateRequest = async (requestId, action) => {
    // simple approach: re-fetch the list after an update
    await loadRequests();
  };

  const tabContent = {
    status: loadingRequests ? (
      <div className="flex-1 flex items-center justify-center">
        Loading requests...
      </div>
    ) : requestsError ? (
      <div className="flex-1 flex items-center justify-center text-red-500">
        {requestsError}
      </div>
    ) : (
      <StatusTab
        userRequests={statusPagination.currentItems}
        pagination={statusPagination}
        itemsPerPage={4}
        onUpdateRequest={handleUpdateRequest}
      />
    ),
    payments: (
      <PaymentsTab
        userPayments={paymentsPagination.currentItems}
        pagination={paymentsPagination}
        itemsPerPage={10}
      />
    ),
    returned: (
      <ReturnedTab
        userReturns={returnsPagination.currentItems}
        pagination={returnsPagination}
        itemsPerPage={4}
      />
    ),
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PageHeader title="My Requests" onToggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-hidden p-4 lg:p-8">
          <div className="w-full bg-white rounded-lg shadow-xl p-8 flex-1 flex flex-col h-full">
            {/* Tab Navigation Section */}
            <div className="flex items-center space-x-12 text-base font-semibold text-gray-700 border-b border-gray-200 -mx-8 px-8 pb-3">
              {/* Status Tab */}
              <button
                onClick={() => setActiveTab("status")}
                className={`relative ${
                  activeTab === "status"
                    ? "text-[#6C4BF4] font-bold"
                    : "text-gray-700"
                }`}
              >
                Status
                {activeTab === "status" && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>

              {/* Payments Tab */}
              <button
                onClick={() => setActiveTab("payments")}
                className={`relative ${
                  activeTab === "payments"
                    ? "text-[#6C4BF4] font-bold"
                    : "text-gray-700"
                }`}
              >
                Payments
                {activeTab === "payments" && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>

              {/* Returned Tab */}
              <button
                onClick={() => setActiveTab("returned")}
                className={`relative ${
                  activeTab === "returned"
                    ? "text-[#6C4BF4] font-bold"
                    : "text-gray-700"
                }`}
              >
                Returned
                {activeTab === "returned" && (
                  <span className="absolute left-0 -bottom-3 h-1 w-full bg-[#6C4BF4] rounded" />
                )}
              </button>
            </div>

            {/* Conditional content based on activeTab */}
            <div className="mt-8 flex-1 flex flex-col min-h-0">
              {tabContent[activeTab] || (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500">
                    Content for the "
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}"
                    tab goes here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
export default MyRequests;
