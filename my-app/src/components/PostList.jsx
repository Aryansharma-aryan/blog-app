import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const POSTS_PER_PAGE = 6;

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const observer = useRef();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(userData);
  }, []);

  const fetchPosts = async (pageNum = 1) => {
  try {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError("🔐 No token found. Please log in.");
      return;
    }

    const res = await axios.get(`http://localhost:4200/api/getPosts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allPosts = res.data;
    const paginated = allPosts.slice(0, pageNum * POSTS_PER_PAGE);
    setPosts(paginated);
    setHasMore(paginated.length < allPosts.length);
    setError(null);
  } catch (err) {
    console.error('Error fetching posts:', err);
    setError('⚠️ Failed to load posts. Try again later.');
  } finally {
    setLoading(false);
    setLoadingMore(false);
  }
};


  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const lastPostRef = useCallback(
    (node) => {
      if (loadingMore || loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, loading]
  );

  const myPosts = posts.filter(
    (post) =>
      currentUser &&
      post.author?._id === currentUser._id &&
      (
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      setDeletingId(id);

      const token = localStorage.getItem('token');
      if (!token) {
        alert("🔐 No token found. Please log in again.");
        return;
      }

      await axios.delete(`http://localhost:4200/api/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Post deleted successfully!");
      setPage(1);         
      fetchPosts(1);      
    } catch (err) {
      console.error("❌ Delete post error:", err);
      alert("❌ Failed to delete post. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const Spinner = () => (
    <div className="flex justify-center items-center py-12">
      <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-400 mt-10">{error}</p>;

  return (
    <div className="bg-[#0e0e0e] min-h-screen py-10 px-5 text-white font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search your blog posts..."
            className="w-full p-4 text-lg bg-gray-900 text-white border border-gray-600 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <h1 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500">
          My Posts
        </h1>

        {myPosts.length === 0 ? (
          <p className="text-center text-gray-400">No matching posts found.</p>
        ) : (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myPosts.map((post, index) => {
              const isLast = index === myPosts.length - 1;

              return (
                <div
                  key={post._id}
                  ref={isLast ? lastPostRef : null}
                  className="bg-gray-900 rounded-xl p-6 border border-gray-700 shadow-lg hover:shadow-red-500/30 transition duration-300 hover:scale-[1.02]"
                >
                   {/* Only show image if present */}
  {post.image && (
    <img
      src={`http://localhost:4200${post.image}`}
      alt="Post"
      className="w-full h-48 object-cover rounded-lg mb-4 border border-gray-700 shadow-md"
    />
  )}
                  <h3 className="text-2xl font-bold mb-2 text-yellow-400">{post.title}</h3>
                  <p className="text-gray-400 mb-3">
                    {post.content ? (
                      post.content.length > 120 ? post.content.slice(0, 120) + "..." : post.content
                    ) : (
                      <i>No content provided.</i>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    <strong>Author:</strong> {post.author?.name || "Unknown"}
                  </p>

                  <div className="flex gap-3 flex-wrap">
                    <Link
                      to={`/post/${post._id}`}
                      className="px-4 py-1 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-700 transition"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit/${post._id}`}
                      className="px-4 py-1 bg-yellow-500 rounded-lg text-white text-sm hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Link>
                    <button
                      disabled={deletingId === post._id}
                      onClick={() => handleDelete(post._id)}
                      className={`px-4 py-1 text-sm rounded-lg text-white transition ${
                        deletingId === post._id
                          ? 'bg-red-800 opacity-60 cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {deletingId === post._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loadingMore && <Spinner />}
      </div>
    </div>
  );
};

export default PostsList;
