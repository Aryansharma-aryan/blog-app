import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Optimized Change Handler ---
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart()
    }));
  }, []);

  // --- Optimized Submit ---
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (loading) return;

      setLoading(true);
      setError("");

      try {
        const res = await axios.post(
          "https://my-blogs-g3ms.onrender.com/api/login",
          {
            email: formData.email.trim(),
            password: formData.password
          },
          { timeout: 10000 }
        );

        const { token, user } = res.data;

        // --- Fast localStorage writes ---
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("userId", user?.id);

        // --- Instant redirect ---
        navigate(user.role === "admin" ? "/admin" : "/", { replace: true });

      } catch (err) {
        setError(err.response?.data?.message || "Login failed. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [formData, loading, navigate]
  );

  const goToSignup = useCallback(() => navigate("/signup"), [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-4 transition-all duration-300"
      >
        <h2 className="text-2xl font-semibold text-center text-green-700">
          Login
        </h2>

        <OptimizedInput
          type="email"
          name="email"
          value={formData.email}
          placeholder="Email"
          onChange={handleChange}
          disabled={loading}
        />

        <OptimizedInput
          type="password"
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleChange}
          disabled={loading}
        />

        {error && (
          <p className="text-red-500 text-center text-sm font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-medium flex justify-center items-center transition-all ${
            loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
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
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <span
            className="text-green-600 cursor-pointer font-medium hover:underline"
            onClick={goToSignup}
          >
            Signup
          </span>
        </p>
      </form>
    </div>
  );
};

// --- Memoized Input Component (zero unnecessary re-renders) ---
const OptimizedInput = React.memo(
  ({ type, name, value, placeholder, onChange, disabled }) => (
    <input
      type={type}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      required
      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-400 outline-none transition-all"
    />
  )
);

export default Login;
