import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../../types';

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Image */}
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        {article.imageUrl ? (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </svg>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Category and Date */}
        <div className="flex items-center justify-between mb-3">
          <Link
            to={`/category/${article.category.slug}`}
            className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: article.category.color }}
          >
            {article.category.name}
          </Link>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {article.publishedAt ? formatDate(article.publishedAt) : formatDate(article.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
          <Link
            to={`/article/${article.id}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {article.title}
          </Link>
        </h2>

        {/* Description */}
        {article.description && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
            {truncateText(article.description, 150)}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            {article.author && (
              <span>By {article.author}</span>
            )}
            <span>{article.feed.name}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {article.viewCount}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {article.bookmarkCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;
