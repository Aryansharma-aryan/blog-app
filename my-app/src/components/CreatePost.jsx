import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ title: "", content: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Redirect if user not logged in ---
  useEffect(() => {
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("user")
    ) {
      navigate("/login");
    }
  }, [navigate]);

  // --- Optimized Input Change Handler ---
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  }, []);

  // --- Optimized Image Handler ---
  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  }, []);

  // --- Optimized Form Submit ---
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      setError("");

      const trimmedTitle = formData.title.trim();
      const trimmedContent = formData.content.trim();

      if (!trimmedTitle || !trimmedContent) {
        setError("Title and content cannot be empty.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const postData = new FormData();

        postData.append("title", trimmedTitle);
        postData.append("content", trimmedContent);
        if (image) postData.append("image", image);

        await axios.post(
          "https://blog-e1e3.onrender.com/api/create",
          postData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
          }
        );

        alert("✅ Post created successfully!");
        navigate("/");
      } catch (err) {
        console.error("❌ Error:", err);
        setError("Failed to create the post. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [loading, formData, image, navigate]
  );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-black via-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-md rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-10 text-white">
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">
          📝 Create a New Post
        </h2>

        {error && (
          <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
          encType="multipart/form-data"
        >
          {/* Title */}
          <OptimizedInput
            label="Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
          />

          {/* Content */}
          <OptimizedTextarea
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
          />

          {/* Image */}
          <OptimizedFileInput
            label="Upload Image"
            onChange={handleImageChange}
          />

          {/* Button */}
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {loading ? "Creating Post..." : "🚀 Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ------------------------------
   Optimized Memoized Components
------------------------------ */

const OptimizedInput = React.memo(({ label, name, type, value, onChange }) => (
  <div>
    <label className="block text-lg font-semibold text-gray-300 mb-2">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full px-5 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-blue-500"
    />
  </div>
));

const OptimizedTextarea = React.memo(
  ({ label, name, value, onChange }) => (
    <div>
      <label className="block text-lg font-semibold text-gray-300 mb-2">
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required
        rows="6"
        className="w-full px-5 py-3 bg-gray-800 text-white rounded-xl border border-gray-600 focus:ring-2 focus:ring-purple-500 resize-none"
      />
    </div>
  )
);

const OptimizedFileInput = React.memo(({ label, onChange }) => (
  <div>
    <label className="block text-lg font-semibold text-gray-300 mb-2">
      {label}
    </label>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="w-full text-white"
    />
  </div>
));

export default CreatePost;
