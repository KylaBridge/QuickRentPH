import { useState, useEffect } from "react";
import ChangeRoleModal from "../ChangeRoleModal";
import DeleteUserModal from "../DeleteUserModal";

const AllUsersTab = ({ query, onUserAction, getAllUsers, deleteUser }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changeRoleModal, setChangeRoleModal] = useState({
    isOpen: false,
    user: null,
  });
  const [deleteUserModal, setDeleteUserModal] = useState({
    isOpen: false,
    user: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        // Map backend user data to UI format if needed
        setUsers(
          data.map((user) => ({
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            status: user.isVerified ? "Active" : "Unverified",
            role: user.role === "admin" ? "Admin" : "User",
            joinDate: user.createdAt ? user.createdAt.slice(0, 10) : "-",
            lastActive: user.updatedAt ? user.updatedAt.slice(0, 10) : "-",
            profileImage: user.profileImage || "/api/placeholder/40/40",
          }))
        );
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getAllUsers]);

  const filteredUsers = users.filter(
    (user) =>
      user.role !== "Admin" && // Filter out admin users
      (user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()))
  );

  const openChangeRoleModal = (user) => {
    setChangeRoleModal({ isOpen: true, user });
  };

  const openDeleteUserModal = (user) => {
    setDeleteUserModal({ isOpen: true, user });
  };

  const handleChangeRole = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );

    if (onUserAction) {
      const user = users.find((u) => u.id === userId);
      onUserAction(`Changed ${user?.name}'s role to ${newRole}`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (onUserAction) {
        const user = users.find((u) => u.id === userId);
        onUserAction(`Deleted user account: ${user?.name}`);
      }
    } catch (err) {
      setError(err.toString());
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <>
      <div className="overflow-x-auto text-xs">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Join Date
              </th>
              {/* Removed Last Active column */}
              <th className="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-3 py-4 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-400">ID: {user.id}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "Suspended"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {user.joinDate}
                  </td>
                  {/* Removed Last Active cell */}
                  <td className="px-3 py-2 whitespace-nowrap font-medium space-x-1">
                    <button
                      onClick={() => openChangeRoleModal(user)}
                      className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => openDeleteUserModal(user)}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <ChangeRoleModal
        user={changeRoleModal.user}
        isOpen={changeRoleModal.isOpen}
        onClose={() => setChangeRoleModal({ isOpen: false, user: null })}
        onConfirm={handleChangeRole}
      />

      <DeleteUserModal
        user={deleteUserModal.user}
        isOpen={deleteUserModal.isOpen}
        onClose={() => setDeleteUserModal({ isOpen: false, user: null })}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default AllUsersTab;
