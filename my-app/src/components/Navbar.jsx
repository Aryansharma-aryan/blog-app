import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    setIsLoggedIn(!!token);
    setIsAdmin(userData?.role === "admin");
  }, [location]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black via-black to-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-3xl font-semibold text-red-400">
            <Link to="/">BlogVerse</Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className={`font-medium ${isActive("/") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
            >
              Home
            </Link>
            <Link
              to="/create"
              className={`font-medium ${isActive("/create") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
            >
              Create Post
            </Link>
            <Link
              to="/posts"
              className={`font-medium ${isActive("/posts") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
            >
              All Posts
            </Link>

            {isAdmin && (
              <Link
                to="/admin/"
                className="font-medium text-white bg-purple-700 px-3 py-1 rounded hover:bg-purple-800 transition"
              >
                Admin Dashboard
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className={`font-medium ${isActive("/login") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`font-medium ${isActive("/signup") ? "text-yellow-400" : "text-white hover:text-yellow-400"}`}
                >
                  Signup
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-400 transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 py-4 bg-gradient-to-r from-indigo-700 via-blue-800 to-indigo-900 space-y-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block font-medium text-white hover:text-yellow-400"
          >
            Home
          </Link>
          <Link
            to="/create"
            onClick={() => setIsOpen(false)}
            className="block font-medium text-white hover:text-yellow-400"
          >
            Create Post
          </Link>
          <Link
            to="/posts"
            onClick={() => setIsOpen(false)}
            className="block font-medium text-white hover:text-yellow-400"
          >
            All Posts
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="block font-medium text-purple-300 hover:text-white"
            >
              Admin Dashboard
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-white hover:text-yellow-400"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block font-medium text-white hover:text-yellow-400"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="block w-full text-left font-medium text-red-300 hover:text-white transition"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
