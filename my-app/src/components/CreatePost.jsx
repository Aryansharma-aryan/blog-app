import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('You must be logged in to create a post');
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const trimmedTitle = formData.title.trim();
    const trimmedContent = formData.content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'https://blog-e1e3.onrender.com/api/create',
        {
          title: trimmedTitle,
          content: trimmedContent,
          author: user.name,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Post created successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Failed to create the post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4">
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
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500"
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
              rows="6"
              className="w-full px-5 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Submit Button */}
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
