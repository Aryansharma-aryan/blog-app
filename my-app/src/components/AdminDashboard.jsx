import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRes = await axios.get('https://blog-app-1-0sja.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(usersRes.data);

        const postsRes = await axios.get('https://blog-app-1-0sja.onrender.com/api/admin/posts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPosts(postsRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err.response?.data || err.message);
      }
    };
    fetchData();
  }, []);

  const deleteUser = async (id) => {
    if (!window.confirm('Delete user?')) return;
    await axios.delete(`https://blog-app-1-0sja.onrender.com/api/admin/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUsers(users.filter(u => u._id !== id));
  };

  const deletePost = async (id) => {
    if (!window.confirm('Delete post?')) return;
    await axios.delete(`https://blog-app-1-0sja.onrender.com/api/admin/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPosts(posts.filter(p => p._id !== id));
  };

  return (
    <div className="p-8 bg-black text-white min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Admin Panel</h2>

      <div className="mb-12">
        <h3 className="text-xl font-semibold mb-2">All Users</h3>
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          users.map(user => (
            <div key={user._id} className="flex justify-between items-center bg-gray-800 p-4 rounded mb-2">
              <span>{user.name} ({user.email}) - {user.role}</span>
              <button onClick={() => deleteUser(user._id)} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          ))
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">All Posts</h3>
        {posts.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          posts.map(post => (
            <div key={post._id} className="flex justify-between items-center bg-gray-800 p-4 rounded mb-2">
              <span>{post.title} by {post.author?.name || "Unknown"}</span>
              <button onClick={() => deletePost(post._id)} className="bg-red-500 px-4 py-1 rounded hover:bg-red-600">Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
