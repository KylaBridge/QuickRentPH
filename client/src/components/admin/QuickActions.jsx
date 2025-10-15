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
      title: "Add New Item",
      description: "Quick add rental item",
      icon: IoAdd,
      color: "bg-blue-500",
      action: () => console.log("Add item"),
    },
    {
      title: "Approve User",
      description: "Verify pending users",
      icon: IoCheckmarkCircle,
      color: "bg-green-500",
      action: () => console.log("Approve user"),
    },
    {
      title: "Review Reports",
      description: "Check reported content",
      icon: IoWarning,
      color: "bg-yellow-500",
      action: () => console.log("Review reports"),
    },
    {
      title: "Manage Rentals",
      description: "Process rental requests",
      icon: IoDocumentTextOutline,
      color: "bg-purple-500",
      action: () => console.log("Manage rentals"),
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
