---
mode: ask
---
# NewsHub - Full Stack Project Prompt for GitHub Copilot

## Project Overview
Create a complete News Aggregator application called **NewsHub** with the following specifications:

**Frontend**: Vite + React + TypeScript + Tailwind CSS  
**Backend**: NestJS + TypeScript  
**Database**: SQLite with TypeORM  
**RSS Parsing**: Python script  
**Deployment**: Vercel (FE) + Render (BE)  

## Project Structure
```
newshub/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts
│   │   ├── auth/               # JWT authentication module
│   │   ├── articles/           # Article CRUD operations
│   │   ├── feeds/              # RSS feed management
│   │   ├── categories/         # News categories
│   │   ├── users/              # User management
│   │   ├── bookmarks/          # Save articles functionality
│   │   ├── search/             # Search functionality
│   │   ├── trending/           # Trending articles
│   │   └── database/           # TypeORM entities and config
│   ├── scripts/
│   │   ├── feed-parser.py      # Python RSS parser
│   │   └── seed-data.ts        # Initial data seeding
│   ├── newshub.sqlite          # SQLite database file
│   └── package.json
├── frontend/                   # Vite React app
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── types/              # TypeScript interfaces
│   │   ├── utils/              # Helper functions
│   │   └── App.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

## Backend Requirements (NestJS + TypeORM)

### 1. Database Entities (TypeORM)
Create the following entities with proper relationships:

**User Entity:**
- id, email, username, password, createdAt, updatedAt
- Relations: bookmarks, preferences

**Feed Entity:**
- id, name, url, category, description, isActive, lastFetched, createdAt, updatedAt
- Relations: articles

**Article Entity:**
- id, title, description, content, url, imageUrl, author, publishedAt, createdAt, updatedAt
- Relations: feed, category, bookmarks, tags
- Indexes on: url (unique), publishedAt, title

**Category Entity:**
- id, name, slug, description, color
- Relations: articles, feeds, userPreferences

**Bookmark Entity:**
- id, userId, articleId, createdAt
- Relations: user, article
- Composite unique constraint on userId + articleId

**UserPreference Entity:**
- id, userId, categoryId, priority
- Relations: user, category

### 2. API Endpoints
Create RESTful endpoints with proper validation, authentication, and error handling:

**Auth Routes:**
- POST /auth/register - User registration
- POST /auth/login - User login with JWT
- GET /auth/profile - Get current user profile

**Articles Routes:**
- GET /articles - List articles with pagination, filtering, sorting
- GET /articles/:id - Get single article
- GET /articles/category/:slug - Articles by category
- GET /articles/trending - Trending articles (most bookmarked)
- GET /articles/search?q=query - Full-text search

**Feeds Routes:**
- GET /feeds - List all feeds
- POST /feeds - Add new feed (admin only)
- PUT /feeds/:id - Update feed
- DELETE /feeds/:id - Delete feed

**Bookmarks Routes:**
- GET /bookmarks - User's bookmarked articles
- POST /bookmarks - Bookmark an article
- DELETE /bookmarks/:articleId - Remove bookmark

**Categories Routes:**
- GET /categories - List all categories
- GET /categories/:slug - Category details

### 3. Background Services
- Cron job service to periodically parse RSS feeds
- Integration with Python RSS parser script
- Article deduplication logic
- Trending articles calculation

## Frontend Requirements (Vite + React)

### 1. Pages & Components Structure
**Main Pages:**
- Home page with latest articles
- Category pages for filtered articles
- Search results page
- Bookmarks page
- User profile/settings
- Auth pages (login/register)

**Key Components:**
- ArticleCard - Display article with bookmark, share options
- CategoryFilter - Filter articles by category
- SearchBar - Search functionality with autocomplete
- Pagination - Navigate through articles
- Navbar - Navigation with user menu
- Sidebar - Category navigation
- TrendingSection - Show trending articles
- InfiniteScroll - Load more articles on scroll

### 2. State Management & API Integration
- Use React Query/TanStack Query for server state
- Create API service layer with axios
- Implement proper error handling and loading states
- JWT token management with automatic refresh
- Optimistic updates for bookmarks

### 3. UI/UX Features
- Responsive design for mobile, tablet, desktop
- Dark/light theme toggle
- Article preview modal
- Smooth animations and transitions
- Loading skeletons
- Empty states
- Toast notifications for actions

## Python RSS Parser Script

Create a robust RSS feed parser with the following features:
- Parse multiple RSS/Atom feeds concurrently
- Extract article metadata (title, description, content, image, author, date)
- Handle different RSS feed formats
- Duplicate detection based on URL
- Image extraction from RSS content
- Error handling and logging
- Command-line interface for manual execution
- Database integration with SQLite/TypeORM

## Technical Specifications

### Backend (NestJS)
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/schedule": "^4.0.0",
    "@nestjs/config": "^3.0.0",
    "typeorm": "^0.3.0",
    "sqlite3": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "passport-jwt": "^4.0.0"
  }
}
```

### Frontend (Vite + React)
```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "@tanstack/react-query": "^4.0.0",
    "axios": "^1.0.0",
    "date-fns": "^2.0.0",
    "lucide-react": "^0.263.0",
    "react-hook-form": "^7.0.0",
    "react-hot-toast": "^2.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^4.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0"
  }
}
```

## Key Features to Implement

### Core Functionality:
1. **RSS Feed Aggregation** - Automatic parsing and storage
2. **Article Management** - CRUD operations with relationships
3. **User Authentication** - JWT-based auth system
4. **Bookmarking System** - Save and organize articles
5. **Search Functionality** - Full-text search across articles
6. **Category Filtering** - Organize news by topics
7. **Trending Articles** - Popular articles based on engagement

### Advanced Features:
1. **Infinite Scrolling** - Smooth article loading
2. **Responsive Design** - Mobile-first approach
3. **Dark Mode** - Theme switching
4. **Real-time Updates** - New articles notification
5. **Article Sharing** - Social sharing capabilities
6. **Reading Progress** - Track reading status
7. **Personalized Feed** - Based on user preferences

## Sample Data Seeds
Include initial data for:
- Categories: Technology, Business, Science, Sports, Entertainment, Politics
- Popular RSS feeds for each category
- Sample articles for testing
- Demo user accounts

## Configuration Files Needed:
- TypeORM configuration for SQLite
- Vite configuration with proxy for development
- Tailwind CSS configuration
- ESLint and Prettier configurations
- Environment variable templates
- Docker files for containerization (optional)
- GitHub Actions for CI/CD

## Security Considerations:
- Input validation and sanitization
- SQL injection prevention (TypeORM handles this)
- XSS protection
- CORS configuration
- Rate limiting for API endpoints
- Password hashing with bcrypt
- JWT token security best practices

## Performance Optimizations:
- Database indexing for frequently queried fields
- Lazy loading for article content
- Image lazy loading and optimization
- API response caching
- Database query optimization
- Frontend code splitting

## Error Handling:
- Global exception filters in NestJS
- Error boundaries in React
- Proper HTTP status codes
- User-friendly error messages
- Logging system for debugging

## For Your Project Files:
- **Repository**: `newshub`
- **Package names**: `newshub-backend`, `newshub-frontend`  
- **Database**: `newshub.sqlite`
- **Environment prefix**: `NEWSHUB_`
- **App title**: "NewsHub - Your Personal News Aggregator"
- **Deployment URL**: newshub.oshoupadhyay.in

Create this complete NewsHub project with production-ready code, proper error handling, TypeScript throughout, comprehensive documentation, and deployment configurations for Vercel (frontend) and Render (backend).