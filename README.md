# NewsHub - Your Personal News Aggregator

A full-stack news aggregation application built with modern technologies.

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with TypeORM
- **Authentication**: JWT with Passport
- **API**: RESTful with validation
- **RSS Parsing**: Python script with asyncio

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **UI Components**: Headless UI + Custom components

### Features
- 📰 RSS feed aggregation from multiple sources
- 🔍 Full-text search functionality
- 📱 Responsive design (mobile-first)
- 🌙 Dark/Light mode toggle
- 🔖 Bookmark articles
- 📊 Trending articles
- 👤 User authentication & profiles
- 🎯 Category-based filtering
- ⚡ Infinite scrolling
- 🚀 Real-time updates

## 📁 Project Structure

```
newshub/
├── backend/                    # NestJS API Server
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── articles/          # Article CRUD operations
│   │   ├── feeds/             # RSS feed management
│   │   ├── categories/        # News categories
│   │   ├── users/             # User management
│   │   ├── bookmarks/         # Bookmark functionality
│   │   ├── search/            # Search functionality
│   │   ├── trending/          # Trending articles
│   │   └── database/          # TypeORM entities
│   ├── scripts/
│   │   ├── feed-parser.py     # Python RSS parser
│   │   └── seed-data.ts       # Database seeding
│   └── newshub.sqlite         # SQLite database
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── contexts/          # React contexts
│   │   ├── services/          # API service layer
│   │   ├── types/             # TypeScript interfaces
│   │   └── utils/             # Helper functions
│   └── public/
└── README.md
```

## 🛠 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NewsHub/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Python dependencies**
   ```bash
   pip install feedparser requests aiohttp
   ```

4. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

5. **Database setup**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm run start:dev
   ```

The backend will be running on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be running on `http://localhost:5173`

### RSS Feed Parser

Run the Python script to populate articles:

```bash
cd backend
python scripts/feed-parser.py
```

Or set it up as a cron job for automatic updates.

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration  
- `GET /api/auth/profile` - Get user profile

### Article Endpoints
- `GET /api/articles` - List articles (with pagination)
- `GET /api/articles/:id` - Get single article
- `GET /api/articles/category/:slug` - Articles by category
- `GET /api/articles/trending` - Trending articles
- `GET /api/articles/search?q=query` - Search articles

### Bookmark Endpoints
- `GET /api/bookmarks` - User bookmarks
- `POST /api/bookmarks` - Bookmark article
- `DELETE /api/bookmarks/:articleId` - Remove bookmark

### Category Endpoints
- `GET /api/categories` - List categories
- `GET /api/categories/:slug` - Category details

## 🎯 Default Data

The application comes with pre-configured:

### Categories
- Technology, Business, Science, Sports, Entertainment, Politics, Health, World

### RSS Feeds
- TechCrunch, Ars Technica, The Verge, Wired
- Reuters Business, BBC Business, MarketWatch
- Science Daily, NASA News, National Geographic
- ESPN, BBC Sport
- And many more...

### Default Users
- **Admin**: admin@newshub.com / admin123
- **Demo**: demo@newshub.com / demo123

## 🚢 Deployment

### Backend (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `npm install && npm run build`
4. Set start command: `npm run start:prod`
5. Add environment variables

### Frontend (Vercel)
1. Import project to Vercel
2. Set framework preset to Vite
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables

### Environment Variables

**Backend (.env)**
```bash
NODE_ENV=production
PORT=3000
NEWSHUB_DATABASE_PATH=newshub.sqlite
NEWSHUB_JWT_SECRET=your-super-secret-key
NEWSHUB_FRONTEND_URL=https://your-frontend-url.vercel.app
```

**Frontend (.env)**
```bash
VITE_API_URL=https://your-backend-url.render.com/api
```

## 🔧 Development Scripts

### Backend
- `npm run start` - Start production server
- `npm run start:dev` - Start development server
- `npm run start:debug` - Start debug mode
- `npm run build` - Build for production
- `npm run seed` - Seed database with initial data
- `npm run feed:parse` - Run RSS parser manually

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Features Overview

### User Features
- Browse latest news from multiple sources
- Search articles with full-text search
- Filter by categories
- Bookmark favorite articles
- View trending articles
- User registration and authentication
- Dark/Light theme toggle
- Responsive design for all devices

### Admin Features
- Manage RSS feeds
- View system statistics
- User management
- Content moderation

### Technical Features
- Automatic RSS feed parsing
- Article deduplication
- Image extraction from RSS content
- Full-text search indexing
- Optimized database queries
- Rate limiting and security
- Error handling and logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- RSS feeds provided by various news organizations
- Icons by Lucide React
- UI inspiration from modern news applications
- Built with ❤️ using modern web technologies

## 📧 Contact

For questions or support, please contact: [your-email@example.com]

---

**NewsHub** - Stay informed, stay connected! 📰✨
