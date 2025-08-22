import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Article, Category } from '../types';
import { publicApiService } from '../services/publicApi';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ArticleCard from '../components/Articles/ArticleCard';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const limit = 12;

  useEffect(() => {
    if (slug) {
      fetchCategoryData();
    }
  }, [slug]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch category info and articles in parallel
      const [categoryResponse, articlesResponse] = await Promise.all([
        publicApiService.getCategory(slug!),
        publicApiService.getArticlesByCategory(slug!, { limit, page: 1 })
      ]);

      setCategory(categoryResponse);
      setArticles(articlesResponse.articles || []);
      setTotal(articlesResponse.total || 0);
      setPage(1);
      setHasMore(articlesResponse.articles?.length === limit);
    } catch (err: any) {
      console.error('Error fetching category data:', err);
      if (err.response?.status === 404) {
        setError('Category not found.');
      } else {
        setError('Failed to load category articles. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMoreArticles = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await publicApiService.getArticlesByCategory(slug!, { 
        limit, 
        page: nextPage 
      });

      const newArticles = response.articles || [];
      setArticles(prev => [...prev, ...newArticles]);
      setPage(nextPage);
      setHasMore(newArticles.length === limit);
    } catch (err) {
      console.error('Error loading more articles:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchCategoryData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {category?.name || 'Category'} News
        </h1>
        {category?.description && (
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {category.description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {total} articles found
          </span>
          {category && (
            <span 
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: category.color || '#3B82F6' }}
            >
              {category.name}
            </span>
          )}
        </div>
      </div>
      
      {articles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            No articles found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            No articles are available in this category yet. Check back later!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          
          {hasMore && (
            <div className="text-center">
              <button
                onClick={loadMoreArticles}
                disabled={loadingMore}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors inline-flex items-center"
              >
                {loadingMore ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Loading...
                  </>
                ) : (
                  'Load More Articles'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
