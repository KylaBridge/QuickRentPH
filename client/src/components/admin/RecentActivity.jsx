import {
  IoPersonOutline,
  IoCubeOutline,
  IoDocumentTextOutline,
  IoCard,
  IoTime,
  IoCheckmarkCircle,
} from "react-icons/io5";

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: "rental_request",
      title: "New rental request",
      description: "John Doe requested to rent MacBook Pro for 5 days",
      user: "John Doe",
      time: "2 minutes ago",
      icon: IoDocumentTextOutline,
      color: "bg-blue-500",
      status: "pending",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment received",
      description: "₱1,500 payment confirmed for rental #12345",
      user: "Maria Santos",
      time: "15 minutes ago",
      icon: IoCard,
      color: "bg-green-500",
      status: "completed",
    },
    {
      id: 3,
      type: "user_registration",
      title: "New user registered",
      description: "Sarah Wilson created a new account",
      user: "Sarah Wilson",
      time: "1 hour ago",
      icon: IoPersonOutline,
      color: "bg-purple-500",
      status: "new",
    },
    {
      id: 4,
      type: "item_submission",
      title: "Item submitted for approval",
      description: "Gaming Chair submitted by Alex Rodriguez",
      user: "Alex Rodriguez",
      time: "2 hours ago",
      icon: IoCubeOutline,
      color: "bg-yellow-500",
      status: "pending",
    },
    {
      id: 5,
      type: "rental_completed",
      title: "Rental completed",
      description: "Camera rental returned by Mike Johnson",
      user: "Mike Johnson",
      time: "3 hours ago",
      icon: IoCheckmarkCircle,
      color: "bg-emerald-500",
      status: "completed",
    },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      new: "bg-blue-100 text-blue-800",
    };

    return badges[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-[#6C4BF4] text-sm font-medium hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              <activity.icon className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-medium text-gray-900 text-sm">
                  {activity.title}
                </h4>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                    activity.status
                  )}`}
                >
                  {activity.status}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">
                {activity.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  by {activity.user}
                </span>
                <span className="text-gray-400 text-xs">{activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
