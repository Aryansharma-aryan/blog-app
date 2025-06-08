import React, { useState } from 'react';
import axios from 'axios'; // direct axios import
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('https://blog-e1e3.onrender.com/api/create', formData);
      navigate('/');
    } catch (err) {
      setError('Failed to create the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4 animate-fadeIn">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-10 text-white">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">📝 Create a New Post</h2>

        {error && <p className="text-red-400 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_2px_rgba(59,130,246,0.4)]"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-2">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_2px_rgba(168,85,247,0.4)] resize-none"
            />
          </div>

          {/* Author */}
          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-2">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-green-500 transition-all duration-300 focus:outline-none focus:shadow-[0_0_10px_2px_rgba(34,197,94,0.4)]"
            />
          </div>

          {/* Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {loading ? 'Creating Post...' : '🚀 Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
