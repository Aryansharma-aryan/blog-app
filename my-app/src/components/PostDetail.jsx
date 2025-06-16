import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load logged-in user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(storedUser);
  }, []);

  // Fetch post data by ID
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:4200/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError('⚠️ Error fetching post. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
  const confirmDelete = window.confirm('Are you sure you want to delete this post?');
  if (!confirmDelete) return;

  setDeleting(true);
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('🔐 No token found. Please log in again.');
      return;
    }

    await axios.delete(`http://localhost:4200/api/delete/${post._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('✅ Post deleted successfully.');
    navigate('/posts'); // Adjust if your post list route differs
  } catch (err) {
    console.error('❌ Delete post error:', err);
    alert('❌ Failed to delete post.');
  } finally {
    setDeleting(false);
  }
};

  const isAuthor = currentUser && post?.userId === currentUser._id;

  if (loading) return <div className="text-center py-20 text-lg text-gray-400">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-20 text-gray-400">Post not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#111111] border border-gray-700 rounded-xl p-8 md:p-12 shadow-xl hover:shadow-[0px_10px_30px_rgba(255,255,255,0.1)] transition-all duration-300">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-pink-500">
            {post.title}
          </h1>

          <p className="text-sm text-gray-400 mb-4">
            Posted by <span className="font-medium text-white">{post.author}</span>
          </p>
           {/* Only show image if present */}
  {post.image && (
    <img
      src={`http://localhost:4200${post.image}`}
      alt="Post"
      className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700 shadow-md"
    />
  )}

          <hr className="border-gray-700 mb-6" />

          <div className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
            {post.content}
          </div>

          {isAuthor && (
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={`/edit/${post._id}`}
                className={`px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition-all ${
                  deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Edit
              </Link>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className={`px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-all ${
                  deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
