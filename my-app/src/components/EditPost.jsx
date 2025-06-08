import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch the current post details for editing
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4100/api/${id}`);
        setFormData({
          title: response.data.title,
          content: response.data.content || response.data.post,
          author: response.data.author,
        });
      } catch (err) {
        setError('Error loading post. Please try again.');
      }
    };
    fetchPost();
  }, [id]);

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission (update the post)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.put(`http://localhost:4100/api/update/${id}`, formData);
      navigate(`/post/${id}`);
    } catch (err) {
      setError('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="max-w-4xl w-full p-8 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center">Edit Post</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-200">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-xl transition-all duration-300"
            />
          </div>

          {/* Content Field */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-200">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="6"
              className="w-full p-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-xl transition-all duration-300"
            />
          </div>

          {/* Author Field */}
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-200">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full p-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 hover:shadow-xl transition-all duration-300"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none transition-all duration-300"
            >
              {loading ? 'Updating Post...' : 'Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
