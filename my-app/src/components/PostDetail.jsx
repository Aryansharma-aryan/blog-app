import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:4100/api/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('Error fetching post. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`http://localhost:4100/api/delete/${post._id}`);
      alert("Post deleted successfully");
      navigate('/posts');
    } catch (err) {
      alert("Failed to delete post.");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>;
  if (!post) return <div className="text-center py-10 text-gray-500">No post found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900 py-16 px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-8 mt-10 transform transition-all duration-300 hover:scale-105 hover:shadow-[0px_12px_30px_rgba(0,255,255,0.5)]">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">{post.title}</h2>
        <p className="text-gray-600 mb-6 text-sm">
          By <span className="font-medium">{post.author}</span>
        </p>
        <p className="text-lg text-gray-700 whitespace-pre-line">{post.content || post.post}</p>

        <div className="mt-8 flex gap-4">
          <Link
            to={`/edit/${post._id}`}
            className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            tabIndex={deleting ? -1 : 0}
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className={`px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition ${deleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
