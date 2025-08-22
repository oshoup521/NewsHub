export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Feed {
  id: number;
  name: string;
  url: string;
  description?: string;
  isActive: boolean;
  lastFetched?: string;
  fetchCount: number;
  errorCount: number;
  lastError?: string;
  fetchIntervalMinutes: number;
  createdAt: string;
  updatedAt: string;
  category: Category;
  categoryId: number;
}

export interface Article {
  id: string;
  title: string;
  description?: string;
  content?: string;
  url: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
  viewCount: number;
  bookmarkCount: number;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  feed: Feed;
  feedId: number;
  category: Category;
  categoryId: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  articleId: string;
  notes?: string;
  createdAt: string;
  article: Article;
}

export interface UserPreference {
  id: number;
  userId: string;
  categoryId: number;
  priority: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isAdmin: boolean;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'bookmarkCount';
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  data?: T[];
  articles?: T[];
  bookmarks?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
