import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const roleOptions = [
    { value: "user", label: "User", color: "bg-gray-500" },
    { value: "premium", label: "Premium", color: "bg-blue-500" },
    { value: "super user", label: "Super User", color: "bg-green-500" },
    { value: "platinum user", label: "Platinum User", color: "bg-purple-500" },
    { value: "tester", label: "Tester", color: "bg-yellow-500" },
    { value: "admin", label: "Admin", color: "bg-red-500" },
    { value: "manager", label: "Manager", color: "bg-indigo-500" },
    { value: "moderator", label: "Moderator", color: "bg-pink-500" },
    { value: "contributor", label: "Contributor", color: "bg-teal-500" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = querySnapshot.docs.map((docSnapshot) => ({
          id: docSnapshot.id,
          ...docSnapshot.data(),
        }));
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditedUserData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role || "user",
    });
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditedUserData({ firstName: "", lastName: "", role: "" });
  };

  const handleSave = async (userId) => {
    try {
      setError("");
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, editedUserData);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...editedUserData } : user
        )
      );
      setEditingUserId(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user. Please try again.");
    }
  };

  const getRoleColor = (role) => {
    return roleOptions.find((r) => r.value === role)?.color || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cyan-300 dark:bg-slate-900">
        <div className="text-white text-xl animate-pulse">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyan-300 dark:bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto bg-gradient-to-r mt-22 from-blue-600 to-cyan-800 rounded-xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Panel - User Management</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        <div className="overflow-x-auto bg-slate-800 rounded-lg">
          <table className="w-full text-left">
            <thead className="bg-slate-900">
              <tr>
                {["Email", "First Name", "Last Name", "Role", "Actions"].map((header) => (
                  <th key={header} className="py-4 px-6 font-semibold text-gray-300">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-700 transition-colors">
                  <td className="py-4 px-6 text-gray-200">{user.email}</td>
                  <td className="py-4 px-6">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedUserData.firstName}
                        onChange={(e) =>
                          setEditedUserData({ ...editedUserData, firstName: e.target.value })
                        }
                        className="w-full p-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-200">{user.firstName || "-"}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedUserData.lastName}
                        onChange={(e) =>
                          setEditedUserData({ ...editedUserData, lastName: e.target.value })
                        }
                        className="w-full p-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <span className="text-gray-200">{user.lastName || "-"}</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingUserId === user.id ? (
                      <select
                        value={editedUserData.role}
                        onChange={(e) =>
                          setEditedUserData({ ...editedUserData, role: e.target.value })
                        }
                        className="w-full p-2 bg-slate-600 border border-slate-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roleOptions.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {roleOptions.find((r) => r.value === user.role)?.label || user.role}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {editingUserId === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(user.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Role Legend</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {roleOptions.map((role) => (
              <div key={role.value} className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${role.color}`} />
                <span className="text-gray-200">{role.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;