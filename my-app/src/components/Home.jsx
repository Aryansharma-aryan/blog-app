import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://blog-e1e3.onrender.com/api/posts');
      setPosts(response.data.slice(0, 6)); // First 6 posts
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('🔐 No token found. Please log in again.');
        return;
      }

      await axios.delete(`https://blog-e1e3.onrender.com/api/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Post deleted successfully.");
      fetchPosts();
    } catch (error) {
      console.error("❌ Failed to delete post:", error);
      alert("❌ Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="w-full py-48 px-5 text-center bg-gradient-to-r from-gray-800 via-black to-gray-900 shadow-2xl flex flex-col mb-8 justify-center items-center">
        <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-yellow-300 via-pink-500 to-purple-600 animate-pulse">
          Welcome to My Blog
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto mt-8">
          Share your thoughts, ideas, and stories with the world. Dive into topics that matter and make an impact.
        </p>
        <Link
          to="/create"
          className="inline-block px-8 py-4 text-white font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg transform transition-all duration-300 hover:scale-105 hover:bg-gradient-to-l hover:from-purple-700 hover:to-indigo-600 hover:shadow-2xl"
        >
          Create a New Post
        </Link>
      </div>

      {/* Scrolling Marquee */}
      <div className="overflow-hidden whitespace-nowrap w-full mt-4">
        <p className="inline-block animate-marquee text-lg text-yellow-400 font-semibold">
          🔥 Stay updated with the latest tech trends, tutorials, and insights – Only on My Blog! 🚀
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8 mt-8">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 text-lg bg-black text-white border border-gray-700 rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-2xl hover:ring-blue-600"
        />
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-screen-xl mx-auto py-12">
        {loading ? (
          <div className="w-full h-screen flex items-center justify-center text-gray-500 text-lg">
            Loading...
          </div>
        ) : filteredPosts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found. Create one now!</p>
        ) : (
          filteredPosts.map((post) => {
            const isAuthor = currentUser && post.userId === currentUser._id;

            return (
              <div
                key={post._id}
                className="bg-black text-white shadow-lg rounded-lg p-6 border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-[0px_8px_25px_rgba(255,165,0,0.6)] hover:bg-gray-800 hover:text-yellow-400"
              >
                 {/* Only show image if present */}
  {post.image && (
    <img
      src={`https://blog-e1e3.onrender.com${post.image}`}
      alt="Post"
      className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700 shadow-md"
    />
  )}
                <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-pink-400 mb-2">
                  {post.title}
                </h3>
                {post.content ? (
                  <p className="text-gray-400 mb-2">
                    {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                  </p>
                ) : (
                  <p className="text-gray-400 mb-2 italic">No content available.</p>
                )}
               <p className="text-sm text-gray-500 mb-4">
  <strong>Author:</strong>{" "}
  {post.author?.name && post.author?.email
    ? `${post.author.name} (${post.author.email})`
    : post.author?.email || "Unknown"}
</p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/post/${post._id}`}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300"
                  >
                    View
                  </Link>

                  {isAuthor && (
                    <>
                      <Link
                        to={`/edit/${post._id}`}
                        className="text-sm px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-all duration-300"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post._id)}
                        disabled={deletingId === post._id}
                        className={`text-sm px-3 py-1 bg-red-600 text-white rounded transition-all duration-300 ${
                          deletingId === post._id ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                        }`}
                      >
                        {deletingId === post._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
