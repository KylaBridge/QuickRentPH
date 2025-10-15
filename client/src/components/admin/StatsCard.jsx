import { IoTrendingUp, IoTrendingDown } from "react-icons/io5";

const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendUp,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
            <div className="w-16 h-4 bg-gray-200 rounded"></div>
          </div>
          <div className="w-20 h-8 bg-gray-200 rounded mb-2"></div>
          <div className="w-24 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div
          className={`flex items-center space-x-1 text-sm ${
            trendUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {trendUp ? (
            <IoTrendingUp className="w-4 h-4" />
          ) : (
            <IoTrendingDown className="w-4 h-4" />
          )}
          <span className="font-medium">{trend}</span>
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;
