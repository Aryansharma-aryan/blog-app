import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:4100/api/get');
      setPosts(response.data);
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
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this post?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:4100/api/delete/${id}`);
      fetchPosts(); // Refresh after delete
    } catch (error) {
      console.error("Failed to delete:", error);
      alert("Failed to delete post.");
    }
  };

  if (loading) return (
    <div className="w-full h-screen flex items-center justify-center text-gray-500 text-lg">
      Loading posts...
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mb-8 ">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-2xl"
        />
      </div>

      {/* Posts List */}
      <div className="max-w-6xl mx-auto px-6 py-12 bg-gray-900">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center">
          All Blog Posts
        </h2>

        {filteredPosts.length === 0 ? (
          <p className="text-center text-gray-400">No posts found. Create one now!</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-800 text-white shadow-lg rounded-lg p-6 border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:shadow-[0px_10px_30px_rgba(255,255,255,0.3)] hover:bg-gray-700"
              >
                <h3 className="text-2xl font-extrabold text-white mb-3">{post.title}</h3>
                <p className="text-gray-400 mb-2">{post.content?.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500 mb-4"><strong>Author:</strong> {post.author}</p>

                <div className="flex flex-wrap gap-3">
                  <Link
                    to={`/post/${post._id}`}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    View
                  </Link>
                  <Link
                    to={`/edit/${post._id}`}
                    className="text-sm px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsList;
