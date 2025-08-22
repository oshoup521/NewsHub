import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary-600">NewsHub</h1>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/bookmarks" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Bookmarks
                </Link>
                <Link to="/profile" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/auth/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
