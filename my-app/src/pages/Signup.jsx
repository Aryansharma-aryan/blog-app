import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Optimized Change Handler ---
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart() // prevents whitespace spam
    }));
  }, []);

  // --- Optimized Submit Handler ---
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (loading) return; // prevents double-clicks

      setLoading(true);
      setError("");

      try {
        const response = await axios.post(
          "https://blog-e1e3.onrender.com/api/signup",
          {
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password
          },
          { timeout: 10000 } // 10s timeout for faster response failure
        );

        if (response.status === 201 || response.status === 200) {
          alert("✅ Signup successful! You can now login.");
          navigate("/login", { replace: true });
        }
      } catch (err) {
        setError(err.response?.data?.message || "Signup failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [formData, loading, navigate]
  );

  const goToLogin = useCallback(() => navigate("/login"), [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 transition-all duration-300"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-700">
          Create Your Account
        </h2>

        <OptimizedInput
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          disabled={loading}
        />

        <OptimizedInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
        />

        <OptimizedInput
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
        />

        {error && (
          <p className="text-red-500 text-center text-sm font-medium">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded text-white font-medium flex justify-center items-center transition-all ${
            loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin mr-2 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              Signing up...
            </>
          ) : (
            "Signup"
          )}
        </button>

        <p className="text-center text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium hover:underline"
            onClick={goToLogin}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

// --- Optimized Input Component (No re-render unless props change) ---
const OptimizedInput = React.memo(
  ({ type, name, value, onChange, placeholder, disabled }) => (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400 outline-none transition-all"
      required
    />
  )
);

export default Signup;
