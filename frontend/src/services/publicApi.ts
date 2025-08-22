import axios, { AxiosInstance } from 'axios';

class PublicApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Articles endpoints (public)
  async getArticles(params: any = {}) {
    const response = await this.api.get('/articles', { params });
    return response.data;
  }

  async getArticle(id: string) {
    const response = await this.api.get(`/articles/${id}`);
    return response.data;
  }

  async getArticlesByCategory(slug: string, params: any = {}) {
    const response = await this.api.get(`/articles/category/${slug}`, { params });
    return response.data;
  }

  async getTrendingArticles(limit = 10) {
    const response = await this.api.get('/articles/trending', { params: { limit } });
    return response.data;
  }

  async searchArticles(query: string, params: any = {}) {
    const response = await this.api.get('/articles/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  }

  // Categories endpoints (public)
  async getCategories() {
    const response = await this.api.get('/categories');
    return response.data;
  }

  async getCategory(slug: string) {
    const response = await this.api.get(`/categories/${slug}`);
    return response.data;
  }

  // Feeds endpoints (public)
  async getFeeds(params: any = {}) {
    const response = await this.api.get('/feeds', { params });
    return response.data;
  }

  async getFeed(id: number) {
    const response = await this.api.get(`/feeds/${id}`);
    return response.data;
  }

  // Search endpoint (public)
  async search(query: string, params: any = {}) {
    const response = await this.api.get('/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  }

  // Trending endpoint (public)
  async getTrending(limit = 10) {
    const response = await this.api.get('/trending', { params: { limit } });
    return response.data;
  }
}

export const publicApiService = new PublicApiService();
