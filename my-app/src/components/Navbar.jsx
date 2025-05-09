import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-black-700 via-black-800 to-black-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 text-3xl font-semibold text-red-400">
            <Link to="/">BlogVerse</Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`font-medium transition-all duration-300 ${
                isActive('/') ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/create"
              className={`font-medium transition-all duration-300 ${
                isActive('/create') ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
              }`}
            >
              Create Post
            </Link>
            <Link
              to="/posts"
              className={`font-medium transition-all duration-300 ${
                isActive('/posts') ? 'text-yellow-400' : 'text-white hover:text-yellow-400'
              }`}
            >
              All Posts
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-400 focus:outline-none transition-all duration-300"
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
            className="block font-medium text-white hover:text-yellow-400 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/create"
            className="block font-medium text-white hover:text-yellow-400 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            Create Post
          </Link>
          <Link
            to="/posts"
            className="block font-medium text-white hover:text-yellow-400 transition-all duration-300"
            onClick={() => setIsOpen(false)}
          >
            All Posts
          </Link>
        </div>
      )}
    </nav>
  );
}
