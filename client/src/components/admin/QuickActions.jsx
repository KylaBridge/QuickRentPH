import {
  IoPersonOutline,
  IoCubeOutline,
  IoDocumentTextOutline,
  IoAdd,
  IoCheckmarkCircle,
  IoWarning,
} from "react-icons/io5";

const QuickActions = () => {
  const actions = [
    {
      title: "Manage Users",
      description: "View and manage all users",
      icon: IoPersonOutline,
      color: "bg-blue-500",
      action: () => (window.location.href = "/admin/users"),
    },
    {
      title: "Manage Rentals",
      description: "View and process rental requests",
      icon: IoCubeOutline,
      color: "bg-green-500",
      action: () => (window.location.href = "/admin/items"),
    },
    {
      title: "View Activity Log",
      description: "See recent admin activities",
      icon: IoDocumentTextOutline,
      color: "bg-purple-500",
      action: () => (window.location.href = "/admin/activity-log"),
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="w-full flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div
              className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center flex-shrink-0`}
            >
              <action.icon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900">{action.title}</h4>
              <p className="text-sm text-gray-600 truncate">
                {action.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
