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

  // Fetch all users from Firestore on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const usersData = [];
        querySnapshot.forEach((docSnapshot) => {
          usersData.push({ id: docSnapshot.id, ...docSnapshot.data() });
        });
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Enable editing mode for a user
  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditedUserData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role || "user",
    });
  };

  // Cancel editing mode
  const handleCancel = () => {
    setEditingUserId(null);
    setEditedUserData({ firstName: "", lastName: "", role: "" });
  };

  // Save updated user data to Firestore and update local state
  const handleSave = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        firstName: editedUserData.firstName,
        lastName: editedUserData.lastName,
        role: editedUserData.role,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, ...editedUserData } : user
        )
      );
      setEditingUserId(null);
    } catch (err) {
      console.error("Error updating user:", err);
      setError("Failed to update user.");
    }
  };

  // Define role key with label and associated Tailwind classes for colors
  const roleKey = [
    { label: "User", className: "bg-gray-500" },
    { label: "Premium", className: "bg-blue-500" },
    { label: "Super User", className: "bg-green-500" },
    { label: "Platinum User", className: "bg-purple-500" },
    { label: "Tester", className: "bg-yellow-500" },
    { label: "Admin", className: "bg-red-500" },
    { label: "Manager", className: "bg-indigo-500" },
    { label: "Moderator", className: "bg-pink-500" },
    { label: "Contributor", className: "bg-teal-500" },
  ];

  if (loading) {
    return <div className="p-8 text-white">Loading users...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <div className="max-w-5xl mx-auto bg-slate-800 shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-6">Admin Panel - User Management</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left border-b border-gray-700">Email</th>
                <th className="py-2 px-4 text-left border-b border-gray-700">First Name</th>
                <th className="py-2 px-4 text-left border-b border-gray-700">Last Name</th>
                <th className="py-2 px-4 text-left border-b border-gray-700">Role</th>
                <th className="py-2 px-4 text-left border-b border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedUserData.firstName}
                        onChange={(e) =>
                          setEditedUserData({
                            ...editedUserData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full p-1 border border-gray-600 rounded bg-slate-700 text-white"
                      />
                    ) : (
                      user.firstName
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedUserData.lastName}
                        onChange={(e) =>
                          setEditedUserData({
                            ...editedUserData,
                            lastName: e.target.value,
                          })
                        }
                        className="w-full p-1 border border-gray-600 rounded bg-slate-700 text-white"
                      />
                    ) : (
                      user.lastName
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <select
                        value={editedUserData.role}
                        onChange={(e) =>
                          setEditedUserData({
                            ...editedUserData,
                            role: e.target.value,
                          })
                        }
                        className="w-full p-1 border border-gray-600 rounded bg-slate-700 text-white"
                      >
                        <option value="user">User</option>
                        <option value="premium">Premium</option>
                        <option value="super user">Super User</option>
                        <option value="platinum user">Platinum User</option>
                        <option value="tester">Tester</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="moderator">Moderator</option>
                        <option value="contributor">Contributor</option>
                      </select>
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editingUserId === user.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSave(user.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-500 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
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
        {/* Role Legend */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Role Legend</h2>
          <div className="flex flex-wrap gap-4">
            {roleKey.map((role) => (
              <div key={role.label} className="flex items-center gap-2">
                <span className={`w-4 h-4 inline-block rounded ${role.className}`} />
                <span>{role.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
