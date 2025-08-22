import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('newshub_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          localStorage.removeItem('newshub_token');
          localStorage.removeItem('newshub_user');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await this.api.post('/auth/register', credentials);
    return response.data;
  }

  async getProfile() {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  // Articles endpoints
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

  // Categories endpoints
  async getCategories() {
    const response = await this.api.get('/categories');
    return response.data;
  }

  async getCategory(slug: string) {
    const response = await this.api.get(`/categories/${slug}`);
    return response.data;
  }

  // Bookmarks endpoints
  async getBookmarks(params: any = {}) {
    const response = await this.api.get('/bookmarks', { params });
    return response.data;
  }

  async createBookmark(articleId: string, notes?: string) {
    const response = await this.api.post('/bookmarks', { articleId, notes });
    return response.data;
  }

  async removeBookmark(articleId: string) {
    const response = await this.api.delete(`/bookmarks/${articleId}`);
    return response.data;
  }

  async checkBookmark(articleId: string) {
    const response = await this.api.get(`/bookmarks/check/${articleId}`);
    return response.data;
  }

  // Feeds endpoints
  async getFeeds() {
    const response = await this.api.get('/feeds');
    return response.data;
  }

  // Search endpoint
  async search(query: string, params: any = {}) {
    const response = await this.api.get('/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  }

  // Trending endpoint
  async getTrending(limit = 10) {
    const response = await this.api.get('/trending', { params: { limit } });
    return response.data;
  }
}

export const apiService = new ApiService();
