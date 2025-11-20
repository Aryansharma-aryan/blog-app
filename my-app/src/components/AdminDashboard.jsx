import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://my-blogs-g3ms.onrender.com/api/admin";   // 🔥 USE THIS FOR DEPLOYED BACKEND

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setFetchError("No token found. Please log in.");
          return;
        }

        const [usersRes, postsRes] = await Promise.all([
          axios.get(`${API_BASE}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE}/posts`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(usersRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setFetchError(
          err.response?.data?.message || "Failed to load dashboard data."
        );
        console.error("Admin fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? All their posts will also delete.")) return;

    try {
      await axios.delete(`${API_BASE}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user.");
      console.error(err);
    }
  };

  // Delete Post
  const deletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await axios.delete(`${API_BASE}/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Failed to delete post.");
      console.error(err);
    }
  };

  // Loading Spinner
  const Spinner = () => (
    <div className="flex justify-center items-center py-20">
      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (loading) return <Spinner />;
  if (fetchError)
    return <p className="text-red-400 text-center mt-20 text-lg">{fetchError}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-12 text-red-400">
        Admin Dashboard
      </h1>

      {/* USERS TABLE */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">👥 Users</h2>

        {users.length === 0 ? (
          <p className="text-gray-400">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-2">{user.name}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2 capitalize">{user.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* POSTS TABLE */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📝 Posts</h2>

        {posts.length === 0 ? (
          <p className="text-gray-400">No posts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-700 text-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Content</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post._id}
                    className="border-t border-gray-700 hover:bg-gray-800 transition"
                  >
                    <td className="px-4 py-2">{post.title}</td>
                    <td className="px-4 py-2">{post.content?.slice(0, 60)}...</td>
                    <td className="px-4 py-2">
                      {post.author?.name || "Unknown"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => deletePost(post._id)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
