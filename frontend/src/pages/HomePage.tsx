import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Latest News
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Articles will be loaded here */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Sample Article Title</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is a sample article description that shows how articles will be displayed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
