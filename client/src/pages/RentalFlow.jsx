import { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoArrowBack, IoCheckmarkCircle, IoWarning } from "react-icons/io5";
import { AuthContext } from "../context/authContext";
import { UserContext } from "../context/userContext";

const RentalFlow = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { getItemById } = useContext(UserContext);

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Form states
  const [rentalDetails, setRentalDetails] = useState({
    startDate: "",
    endDate: "",
    duration: 0,
    selectedAddress: null,
    deliveryType: "pickup",
    notes: "",
  });

  const [paymentData, setPaymentData] = useState({
    method: "gcash",
    termsAccepted: false,
    breakdown: {
      rentalDays: 0,
      rentalCost: 0,
      serviceFee: 0,
      taxes: 0,
      total: 0,
    },
  });

  // Fetch item data
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const fetchedItem = await getItemById(itemId);
        setItem(fetchedItem);
      } catch (error) {
        console.error("Failed to fetch item:", error);
        navigate("/items-for-rent");
      } finally {
        setLoading(false);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId, getItemById, navigate]);

  // Calculate rental cost when dates change
  useEffect(() => {
    if (rentalDetails.startDate && rentalDetails.endDate && item?.price) {
      const start = new Date(rentalDetails.startDate);
      const end = new Date(rentalDetails.endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

      if (days > 0) {
        const rentalCost = days * item.price;
        const serviceFee = rentalCost * 0.1; // 10% service fee
        const taxes = rentalCost * 0.12; // 12% tax
        const total = rentalCost + serviceFee + taxes;

        setRentalDetails((prev) => ({ ...prev, duration: days }));
        setPaymentData((prev) => ({
          ...prev,
          breakdown: {
            rentalDays: days,
            rentalCost,
            serviceFee,
            taxes,
            total,
          },
        }));
      }
    }
  }, [rentalDetails.startDate, rentalDetails.endDate, item?.price]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCompleteRental = async () => {
    try {
      // TODO: Implement rental completion logic
      console.log("Completing rental:", { rentalDetails, paymentData, item });
      navigate("/my-rentals");
    } catch (error) {
      console.error("Failed to complete rental:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading item details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <IoWarning className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Item Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The item you're looking for could not be found.
            </p>
            <button
              onClick={() => navigate("/items-for-rent")}
              className="bg-[#6C4BF4] text-white px-4 py-2 rounded-md hover:bg-[#7857FD]"
            >
              Back to Items
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center">
          <button
            onClick={handleBack}
            className="mr-2 p-2 rounded-full hover:bg-gray-100 text-[#6C4BF4] focus:outline-none"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          <span className="text-xl font-semibold text-gray-900">
            Rent: {item.name}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, label: "Rental Details" },
              { step: 2, label: "Address" },
              { step: 3, label: "Payment" },
              { step: 4, label: "Confirmation" },
            ].map(({ step, label }) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? "bg-[#6C4BF4] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step < currentStep ? (
                    <IoCheckmarkCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    step <= currentStep ? "text-[#6C4BF4]" : "text-gray-600"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            {/* Step Content will be rendered here */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Rental Details
                </h2>
                <p className="text-gray-600 mb-6">
                  Please specify your rental dates and preferences.
                </p>

                {/* Rental dates form content will go here */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={rentalDetails.startDate}
                      onChange={(e) =>
                        setRentalDetails((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={rentalDetails.endDate}
                      onChange={(e) =>
                        setRentalDetails((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6C4BF4]"
                    />
                  </div>

                  {rentalDetails.duration > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900">
                        Rental Summary
                      </h3>
                      <p className="text-sm text-blue-700">
                        Duration: {rentalDetails.duration} day(s)
                      </p>
                      <p className="text-sm text-blue-700">
                        Total Cost: ₱{paymentData.breakdown.total.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    disabled={
                      !rentalDetails.startDate || !rentalDetails.endDate
                    }
                    className="bg-[#6C4BF4] text-white px-6 py-2 rounded-md hover:bg-[#7857FD] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Additional steps will be implemented here */}
            {currentStep > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Step {currentStep} - Coming Soon
                </h2>
                <p className="text-gray-600 mb-6">
                  This step is under development.
                </p>

                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                  >
                    Back
                  </button>

                  {currentStep < 4 ? (
                    <button
                      onClick={handleNextStep}
                      className="bg-[#6C4BF4] text-white px-6 py-2 rounded-md hover:bg-[#7857FD]"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleCompleteRental}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
                    >
                      Complete Rental
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RentalFlow;
