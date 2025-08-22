#!/usr/bin/env python3
"""
Seed script to populate initial categories and RSS feeds for NewsHub
"""

import sqlite3
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def seed_database():
    """Populate the database with initial categories and RSS feeds"""
    try:
        # Connect to database
        conn = sqlite3.connect('newshub.sqlite')
        cursor = conn.cursor()
        
        # Check if data already exists
        cursor.execute('SELECT COUNT(*) FROM categories')
        category_count = cursor.fetchone()[0]
        
        if category_count > 0:
            logger.info(f"Categories already exist ({category_count} found). Skipping seed.")
            conn.close()
            return
            
        # Insert initial categories
        categories = [
            ('technology', 'Technology', 'Latest technology news and updates', '#007BFF'),
            ('business', 'Business', 'Business and finance news', '#28A745'),
            ('science', 'Science', 'Scientific discoveries and research', '#6F42C1'),
            ('health', 'Health', 'Health and medical news', '#DC3545'),
            ('sports', 'Sports', 'Sports news and updates', '#FD7E14'),
            ('entertainment', 'Entertainment', 'Entertainment and celebrity news', '#E83E8C'),
            ('world', 'World', 'International news and events', '#20C997'),
            ('politics', 'Politics', 'Political news and updates', '#6C757D')
        ]
        
        logger.info("Inserting categories...")
        for category in categories:
            cursor.execute('''
                INSERT INTO categories (slug, name, description, color)
                VALUES (?, ?, ?, ?)
            ''', category)
        
        # Get category IDs for feeds
        cursor.execute('SELECT id, slug FROM categories')
        category_map = {slug: id for id, slug in cursor.fetchall()}
        
        # Insert RSS feeds
        feeds = [
            # Technology feeds
            ('TechCrunch', 'https://techcrunch.com/feed/', 'Leading technology media property', True, category_map['technology']),
            ('Ars Technica', 'http://feeds.arstechnica.com/arstechnica/index', 'Technology news and information', True, category_map['technology']),
            ('The Verge', 'https://www.theverge.com/rss/index.xml', 'Technology, science, art, and culture', True, category_map['technology']),
            
            # Business feeds  
            ('Reuters Business', 'https://feeds.reuters.com/reuters/businessNews', 'Business news from Reuters', True, category_map['business']),
            ('BBC Business', 'http://feeds.bbci.co.uk/news/business/rss.xml', 'BBC Business news', True, category_map['business']),
            
            # Science feeds
            ('Science Daily', 'https://www.sciencedaily.com/rss/all.xml', 'Latest science news', True, category_map['science']),
            ('NASA News', 'https://www.nasa.gov/news/releases/latest/index.html', 'NASA news and updates', True, category_map['science']),
            
            # Health feeds
            ('WebMD', 'https://www.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC', 'Health and medical news', True, category_map['health']),
            ('Healthline', 'https://www.healthline.com/health-news/feed', 'Health news and information', True, category_map['health']),
            
            # Sports feeds
            ('ESPN', 'https://www.espn.com/espn/rss/news', 'Sports news from ESPN', True, category_map['sports']),
            ('BBC Sport', 'http://feeds.bbci.co.uk/sport/rss.xml', 'BBC Sports news', True, category_map['sports']),
            
            # World news feeds
            ('BBC World', 'http://feeds.bbci.co.uk/news/world/rss.xml', 'BBC World news', True, category_map['world']),
            ('CNN World', 'http://rss.cnn.com/rss/edition.rss', 'CNN World news', True, category_map['world']),
            
            # Alternative working feeds (if above don't work)
            ('Hacker News', 'https://hnrss.org/frontpage', 'Hacker News frontpage', True, category_map['technology']),
            ('Google News', 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en', 'Google News', True, category_map['world'])
        ]
        
        logger.info("Inserting RSS feeds...")
        for feed in feeds:
            cursor.execute('''
                INSERT INTO feeds (name, url, description, isActive, categoryId)
                VALUES (?, ?, ?, ?, ?)
            ''', feed)
        
        # Commit changes
        conn.commit()
        conn.close()
        
        logger.info(f"✅ Successfully seeded database with {len(categories)} categories and {len(feeds)} feeds")
        
    except Exception as e:
        logger.error(f"❌ Error seeding database: {e}")
        if conn:
            conn.rollback()
            conn.close()

if __name__ == "__main__":
    seed_database()
