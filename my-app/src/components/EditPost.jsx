import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '', // existing image URL
    imageFile: null // selected new file
  });

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
      alert('Login required');
      navigate('/login');
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://blog-e1e3.onrender.com/api/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const post = res.data;

        if (post.userId !== user?._id) {
          alert("You can't edit someone else's post.");
          navigate('/');
          return;
        }

        setFormData({
          title: post.title,
          content: post.content,
          imageUrl: post.image || '', // existing image URL
          imageFile: null
        });
      } catch (err) {
        console.error(err);
        setError('Failed to load post. Please try again.');
      }
    };

    if (user) {
      fetchPost();
    }
  }, [id, user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('content', formData.content.trim());
      if (formData.imageFile) {
        data.append('image', formData.imageFile); // send new image only if selected
      }

      await axios.put(`https://blog-e1e3.onrender.com/api/update/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Post updated successfully!');
      navigate(`/post/${id}`);
    } catch (err) {
      console.error(err);
      setError('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center">
      <div className="max-w-4xl w-full p-8 bg-gray-900 rounded-lg shadow-lg">
        <h2 className="text-4xl font-extrabold text-white mb-6 text-center">✏️ Edit Post</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {loading && <p className="text-gray-400 text-center mb-4 animate-pulse">Loading...</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-200">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-200">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="6"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-medium text-gray-200">Image</label>
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Post preview"
                className="w-full h-64 object-cover rounded mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-gray-200"
            />
          </div>

          <div className="text-sm text-gray-400">Author: {user?.name}</div>

          <div className="mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              {loading ? 'Updating Post...' : '✅ Update Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
