import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const categories = [
  { name: 'Technology', slug: 'technology' },
  { name: 'Business', slug: 'business' },
  { name: 'Science', slug: 'science' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Entertainment', slug: 'entertainment' },
  { name: 'Politics', slug: 'politics' },
  { name: 'Health', slug: 'health' },
  { name: 'World', slug: 'world' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Categories
        </h2>
        <nav className="space-y-2">
          <Link
            to="/"
            className={`block px-3 py-2 rounded-md text-sm font-medium ${
              location.pathname === '/'
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
            }`}
          >
            All News
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === `/category/${category.slug}`
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-800 dark:text-primary-200'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700'
              }`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
