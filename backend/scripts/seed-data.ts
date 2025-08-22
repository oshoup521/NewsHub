import { DataSource } from 'typeorm';
import { Category } from '../src/database/entities/category.entity';
import { Feed } from '../src/database/entities/feed.entity';
import { User } from '../src/database/entities/user.entity';
import * as bcrypt from 'bcryptjs';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'newshub.sqlite',
  entities: [Category, Feed, User],
  synchronize: true,
  logging: true,
});

const categories = [
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech news, gadgets, and innovations',
    color: '#3B82F6',
    priority: 10,
  },
  {
    name: 'Business',
    slug: 'business',
    description: 'Business news, finance, and economic updates',
    color: '#10B981',
    priority: 9,
  },
  {
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries and research',
    color: '#8B5CF6',
    priority: 8,
  },
  {
    name: 'Sports',
    slug: 'sports',
    description: 'Sports news and updates',
    color: '#F59E0B',
    priority: 7,
  },
  {
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Movies, TV, music, and celebrity news',
    color: '#EF4444',
    priority: 6,
  },
  {
    name: 'Politics',
    slug: 'politics',
    description: 'Political news and government updates',
    color: '#6366F1',
    priority: 5,
  },
  {
    name: 'Health',
    slug: 'health',
    description: 'Health, wellness, and medical news',
    color: '#14B8A6',
    priority: 4,
  },
  {
    name: 'World',
    slug: 'world',
    description: 'International news and global events',
    color: '#F97316',
    priority: 3,
  },
];

const feeds = [
  // Technology feeds
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    categorySlug: 'technology',
    description: 'Latest technology news and startup information',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    categorySlug: 'technology',
    description: 'Technology news and analysis',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    categorySlug: 'technology',
    description: 'Technology, science, art, and culture',
  },
  {
    name: 'Wired',
    url: 'https://www.wired.com/feed/rss',
    categorySlug: 'technology',
    description: 'Technology trends and digital culture',
  },
  
  // Business feeds
  {
    name: 'Reuters Business',
    url: 'https://feeds.reuters.com/reuters/businessNews',
    categorySlug: 'business',
    description: 'Global business news from Reuters',
  },
  {
    name: 'BBC Business',
    url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
    categorySlug: 'business',
    description: 'Business news from BBC',
  },
  {
    name: 'MarketWatch',
    url: 'http://feeds.marketwatch.com/marketwatch/topstories',
    categorySlug: 'business',
    description: 'Financial news and market analysis',
  },
  
  // Science feeds
  {
    name: 'Science Daily',
    url: 'https://www.sciencedaily.com/rss/all.xml',
    categorySlug: 'science',
    description: 'Latest scientific discoveries',
  },
  {
    name: 'NASA News',
    url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    categorySlug: 'science',
    description: 'NASA news and space exploration',
  },
  {
    name: 'National Geographic',
    url: 'https://www.nationalgeographic.com/news/rss/',
    categorySlug: 'science',
    description: 'Science, environment, and exploration',
  },
  
  // Sports feeds
  {
    name: 'ESPN',
    url: 'https://www.espn.com/espn/rss/news',
    categorySlug: 'sports',
    description: 'Sports news and updates',
  },
  {
    name: 'BBC Sport',
    url: 'http://feeds.bbci.co.uk/sport/rss.xml',
    categorySlug: 'sports',
    description: 'Sports news from BBC',
  },
  
  // Entertainment feeds
  {
    name: 'Entertainment Weekly',
    url: 'https://ew.com/feed/',
    categorySlug: 'entertainment',
    description: 'Entertainment news and celebrity updates',
  },
  {
    name: 'Variety',
    url: 'https://variety.com/feed/',
    categorySlug: 'entertainment',
    description: 'Entertainment industry news',
  },
  
  // World News feeds
  {
    name: 'BBC World News',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    categorySlug: 'world',
    description: 'World news from BBC',
  },
  {
    name: 'Reuters World News',
    url: 'https://feeds.reuters.com/Reuters/worldNews',
    categorySlug: 'world',
    description: 'Global news from Reuters',
  },
  {
    name: 'Associated Press',
    url: 'https://feeds.ap.org/ap/news',
    categorySlug: 'world',
    description: 'Breaking news from AP',
  },
  
  // Health feeds
  {
    name: 'WebMD Health News',
    url: 'https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC',
    categorySlug: 'health',
    description: 'Health and medical news',
  },
  {
    name: 'Medical News Today',
    url: 'https://www.medicalnewstoday.com/rss',
    categorySlug: 'health',
    description: 'Latest medical research and health news',
  },
];

const users = [
  {
    email: 'admin@newshub.com',
    username: 'admin',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    isAdmin: true,
  },
  {
    email: 'demo@newshub.com',
    username: 'demo',
    password: 'demo123',
    firstName: 'Demo',
    lastName: 'User',
    isAdmin: false,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
    
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    
    // Clear feeds first (due to foreign key constraints)
    const existingFeedRepository = AppDataSource.getRepository(Feed);
    const existingFeeds = await existingFeedRepository.find();
    if (existingFeeds.length > 0) {
      await existingFeedRepository.remove(existingFeeds);
    }
    
    // Clear categories
    const existingCategoryRepository = AppDataSource.getRepository(Category);
    const existingCategories = await existingCategoryRepository.find();
    if (existingCategories.length > 0) {
      await existingCategoryRepository.remove(existingCategories);
    }
    
    // Clear users
    const existingUserRepository = AppDataSource.getRepository(User);
    const existingUsers = await existingUserRepository.find();
    if (existingUsers.length > 0) {
      await existingUserRepository.remove(existingUsers);
    }
    
    console.log('🗑️  Cleared existing data');
    
    // Seed categories
    console.log('📂 Seeding categories...');
    const categoryRepository = AppDataSource.getRepository(Category);
    const savedCategories = await categoryRepository.save(categories);
    console.log(`✅ Created ${savedCategories.length} categories`);
    
    // Seed feeds
    console.log('📡 Seeding feeds...');
    const feedRepository = AppDataSource.getRepository(Feed);
    
    for (const feedData of feeds) {
      const category = savedCategories.find(c => c.slug === feedData.categorySlug);
      if (category) {
        const feed = feedRepository.create({
          name: feedData.name,
          url: feedData.url,
          description: feedData.description,
          categoryId: category.id,
          category: category,
        });
        await feedRepository.save(feed);
      }
    }
    
    console.log(`✅ Created ${feeds.length} feeds`);
    
    // Seed users
    console.log('👥 Seeding users...');
    const userRepository = AppDataSource.getRepository(User);
    
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      await userRepository.save(user);
    }
    
    console.log(`✅ Created ${users.length} users`);
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📋 Default users:');
    console.log('  Admin: admin@newshub.com / admin123');
    console.log('  Demo:  demo@newshub.com / demo123');
    console.log('');
    console.log('🚀 You can now run the RSS parser to fetch articles:');
    console.log('  python scripts/feed-parser.py');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await AppDataSource.destroy();
  }
}

seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
