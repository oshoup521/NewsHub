#!/usr/bin/env python3
"""
NewsHub RSS Feed Parser
Parses RSS/Atom feeds and stores articles in SQLite database
"""

import sqlite3
import feedparser
import requests
import asyncio
import aiohttp
import logging
import re
from datetime import datetime
from typing import List, Dict, Optional
from urllib.parse import urljoin, urlparse
from pathlib import Path
import argparse
from dataclasses import dataclass

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class Article:
    title: str
    description: Optional[str]
    content: Optional[str]
    url: str
    image_url: Optional[str]
    author: Optional[str]
    published_at: Optional[datetime]
    feed_id: int
    category_id: int

class RSSParser:
    def __init__(self, db_path: str = "newshub.sqlite"):
        self.db_path = db_path
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={'User-Agent': 'NewsHub RSS Parser 1.0'}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def get_db_connection(self):
        """Get SQLite database connection"""
        return sqlite3.connect(self.db_path)
    
    def get_active_feeds(self) -> List[Dict]:
        """Get all active RSS feeds from database"""
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT f.id, f.name, f.url, f.categoryId, f.fetchIntervalMinutes
            FROM feeds f
            WHERE f.isActive = 1
        """)
        
        feeds = []
        for row in cursor.fetchall():
            feeds.append({
                'id': row[0],
                'name': row[1],
                'url': row[2],
                'category_id': row[3],
                'interval': row[4]
            })
        
        conn.close()
        return feeds
    
    async def fetch_feed(self, feed_url: str) -> Optional[dict]:
        """Fetch and parse RSS feed"""
        try:
            async with self.session.get(feed_url) as response:
                if response.status != 200:
                    logger.error(f"Failed to fetch {feed_url}: HTTP {response.status}")
                    return None
                
                content = await response.text()
                parsed_feed = feedparser.parse(content)
                
                if parsed_feed.bozo:
                    logger.warning(f"Feed may have issues: {feed_url}")
                
                return parsed_feed
                
        except Exception as e:
            logger.error(f"Error fetching feed {feed_url}: {str(e)}")
            return None
    
    def extract_image_url(self, entry: dict, feed_url: str) -> Optional[str]:
        """Extract image URL from RSS entry"""
        # Try different methods to find image
        image_url = None
        
        # Method 1: Check for media content
        if 'media_content' in entry and entry.media_content:
            for media in entry.media_content:
                if media.get('medium') == 'image' or 'image' in media.get('type', ''):
                    image_url = media.get('url')
                    break
        
        # Method 2: Check for enclosures
        if not image_url and 'enclosures' in entry:
            for enclosure in entry.enclosures:
                if enclosure.type and 'image' in enclosure.type:
                    image_url = enclosure.href
                    break
        
        # Method 3: Check for media thumbnail
        if not image_url and 'media_thumbnail' in entry and entry.media_thumbnail:
            image_url = entry.media_thumbnail[0].get('url')
        
        # Method 4: Check for itunes:image or other image fields
        if not image_url:
            # Check for various image fields in entry
            for field in ['image', 'itunes_image', 'media_thumbnail']:
                if hasattr(entry, field) and getattr(entry, field):
                    img_data = getattr(entry, field)
                    if isinstance(img_data, str):
                        image_url = img_data
                        break
                    elif isinstance(img_data, dict) and 'url' in img_data:
                        image_url = img_data['url']
                        break
                    elif isinstance(img_data, list) and img_data and 'url' in img_data[0]:
                        image_url = img_data[0]['url']
                        break
        
        # Method 5: Extract from description or content (enhanced)
        if not image_url:
            content = entry.get('description', '') or entry.get('summary', '')
            if 'content' in entry and entry.content:
                if isinstance(entry.content, list) and entry.content:
                    content = entry.content[0].get('value', '')
                else:
                    content = str(entry.content)
            
            if content:
                # Try multiple image extraction patterns
                patterns = [
                    r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>',
                    r'<img[^>]+src=([^>\s]+)[^>]*>',
                    r'src=["\']([^"\']*\.(jpg|jpeg|png|gif|webp))["\']',
                    r'(https?://[^\s<>"]+\.(jpg|jpeg|png|gif|webp))',
                ]
                
                for pattern in patterns:
                    img_match = re.search(pattern, content, re.IGNORECASE)
                    if img_match:
                        image_url = img_match.group(1)
                        break
        
        # Method 6: For specific feed types, try web scraping (light scraping)
        if not image_url and feed_url:
            try:
                # Get domain from feed URL for targeted extraction
                domain = urlparse(feed_url).netloc.lower()
                article_url = entry.get('link', '')
                
                # For TechCrunch, try to get featured image from article page
                if 'techcrunch.com' in domain and article_url:
                    image_url = self.extract_techcrunch_image(article_url)
                # For The Verge, extract from article page
                elif 'theverge.com' in domain and article_url:
                    image_url = self.extract_verge_image(article_url)
                    
            except Exception as e:
                logger.debug(f"Error in web scraping for image: {str(e)}")
        
        # Convert relative URLs to absolute
        if image_url and not image_url.startswith(('http://', 'https://')):
            image_url = urljoin(feed_url, image_url)
        
        # Validate image URL
        if image_url and self.is_valid_image_url(image_url):
            return image_url
        
        return None
        
    def is_valid_image_url(self, url: str) -> bool:
        """Validate if URL looks like an image"""
        if not url:
            return False
            
        # Check if URL has image extension
        image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp')
        url_lower = url.lower()
        
        # Direct image file check
        if any(url_lower.endswith(ext) for ext in image_extensions):
            return True
            
        # Check for common image URL patterns
        if any(pattern in url_lower for pattern in ['image', 'img', 'photo', 'picture']):
            return True
            
        return False
    
    async def extract_techcrunch_image(self, article_url: str) -> Optional[str]:
        """Extract featured image from TechCrunch article"""
        try:
            async with self.session.get(article_url) as response:
                if response.status == 200:
                    content = await response.text()
                    # Look for featured image in meta tags
                    patterns = [
                        r'<meta property="og:image" content="([^"]+)"',
                        r'<meta name="twitter:image" content="([^"]+)"',
                        r'<img[^>]+class="[^"]*featured-image[^"]*"[^>]+src="([^"]+)"',
                    ]
                    
                    for pattern in patterns:
                        match = re.search(pattern, content)
                        if match:
                            return match.group(1)
        except Exception as e:
            logger.debug(f"Error extracting TechCrunch image: {str(e)}")
        return None
    
    async def extract_verge_image(self, article_url: str) -> Optional[str]:
        """Extract featured image from The Verge article"""
        try:
            async with self.session.get(article_url) as response:
                if response.status == 200:
                    content = await response.text()
                    # Look for featured image in meta tags
                    patterns = [
                        r'<meta property="og:image" content="([^"]+)"',
                        r'<meta name="twitter:image" content="([^"]+)"',
                        r'<img[^>]+data-original="([^"]+)"',
                    ]
                    
                    for pattern in patterns:
                        match = re.search(pattern, content)
                        if match:
                            return match.group(1)
        except Exception as e:
            logger.debug(f"Error extracting Verge image: {str(e)}")
        return None
        
    async def extract_sciencedaily_image(self, article_url: str) -> Optional[str]:
        """Extract featured image from Science Daily article"""
        try:
            async with self.session.get(article_url) as response:
                if response.status == 200:
                    content = await response.text()
                    # Look for featured image in meta tags or specific Science Daily patterns
                    patterns = [
                        r'<meta property="og:image" content="([^"]+)"',
                        r'<meta name="twitter:image" content="([^"]+)"',
                        r'<img[^>]+id="story_image"[^>]+src="([^"]+)"',
                        r'<img[^>]+class="[^"]*story-image[^"]*"[^>]+src="([^"]+)"',
                    ]
                    
                    for pattern in patterns:
                        match = re.search(pattern, content)
                        if match:
                            return match.group(1)
        except Exception as e:
            logger.debug(f"Error extracting Science Daily image: {str(e)}")
        return None
        
    async def extract_image_url_async(self, entry: dict, feed_url: str) -> Optional[str]:
        """Async version of extract_image_url with web scraping capability"""
        # First try all the non-async methods
        image_url = None
        
        # Method 1: Check for media content
        if 'media_content' in entry and entry.media_content:
            for media in entry.media_content:
                if media.get('medium') == 'image' or 'image' in media.get('type', ''):
                    image_url = media.get('url')
                    break
        
        # Method 2: Check for enclosures
        if not image_url and 'enclosures' in entry:
            for enclosure in entry.enclosures:
                if enclosure.type and 'image' in enclosure.type:
                    image_url = enclosure.href
                    break
        
        # Method 3: Check for media thumbnail
        if not image_url and 'media_thumbnail' in entry and entry.media_thumbnail:
            image_url = entry.media_thumbnail[0].get('url')
        
        # Method 4: Check for itunes:image or other image fields
        if not image_url:
            # Check for various image fields in entry
            for field in ['image', 'itunes_image', 'media_thumbnail']:
                if hasattr(entry, field) and getattr(entry, field):
                    img_data = getattr(entry, field)
                    if isinstance(img_data, str):
                        image_url = img_data
                        break
                    elif isinstance(img_data, dict) and 'url' in img_data:
                        image_url = img_data['url']
                        break
                    elif isinstance(img_data, list) and img_data and 'url' in img_data[0]:
                        image_url = img_data[0]['url']
                        break
        
        # Method 5: Extract from description or content (enhanced)
        if not image_url:
            content = entry.get('description', '') or entry.get('summary', '')
            if 'content' in entry and entry.content:
                if isinstance(entry.content, list) and entry.content:
                    content = entry.content[0].get('value', '')
                else:
                    content = str(entry.content)
            
            if content:
                # Try multiple image extraction patterns
                patterns = [
                    r'<img[^>]+src=["\']([^"\']+)["\'][^>]*>',
                    r'<img[^>]+src=([^>\s]+)[^>]*>',
                    r'src=["\']([^"\']*\.(jpg|jpeg|png|gif|webp))["\']',
                    r'(https?://[^\s<>"]+\.(jpg|jpeg|png|gif|webp))',
                ]
                
                for pattern in patterns:
                    img_match = re.search(pattern, content, re.IGNORECASE)
                    if img_match:
                        image_url = img_match.group(1)
                        break
        
        # Method 6: For specific feed types, try web scraping (async)
        if not image_url and feed_url:
            try:
                # Get domain from feed URL for targeted extraction
                domain = urlparse(feed_url).netloc.lower()
                article_url = entry.get('link', '')
                
                # For TechCrunch, try to get featured image from article page
                if 'techcrunch.com' in domain and article_url:
                    image_url = await self.extract_techcrunch_image(article_url)
                # For The Verge, extract from article page
                elif 'theverge.com' in domain and article_url:
                    image_url = await self.extract_verge_image(article_url)
                # For Science Daily, try scraping
                elif 'sciencedaily.com' in domain and article_url:
                    image_url = await self.extract_sciencedaily_image(article_url)
                    
            except Exception as e:
                logger.debug(f"Error in web scraping for image: {str(e)}")
        
        # Convert relative URLs to absolute
        if image_url and not image_url.startswith(('http://', 'https://')):
            image_url = urljoin(feed_url, image_url)
        
        # Validate image URL
        if image_url and self.is_valid_image_url(image_url):
            return image_url
        
        return None
    
    def clean_html(self, text: str) -> str:
        """Remove HTML tags from text"""
        if not text:
            return ""
        
        # Remove HTML tags
        clean = re.sub(r'<[^>]+>', '', text)
        # Replace common HTML entities
        clean = clean.replace('&amp;', '&')
        clean = clean.replace('&lt;', '<')
        clean = clean.replace('&gt;', '>')
        clean = clean.replace('&quot;', '"')
        clean = clean.replace('&#39;', "'")
        clean = clean.replace('&nbsp;', ' ')
        
        return clean.strip()
    
    def parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse various date formats"""
        if not date_str:
            return None
        
        try:
            # Try feedparser's date parsing first
            parsed = feedparser._parse_date(date_str)
            if parsed:
                return datetime(*parsed[:6])
        except:
            pass
        
        # Common date formats
        date_formats = [
            '%a, %d %b %Y %H:%M:%S %Z',
            '%a, %d %b %Y %H:%M:%S %z',
            '%Y-%m-%dT%H:%M:%S%z',
            '%Y-%m-%dT%H:%M:%SZ',
            '%Y-%m-%d %H:%M:%S',
            '%Y-%m-%d',
        ]
        
        for fmt in date_formats:
            try:
                return datetime.strptime(date_str, fmt)
            except ValueError:
                continue
        
        logger.warning(f"Could not parse date: {date_str}")
        return None
    
    def article_exists(self, url: str) -> bool:
        """Check if article already exists in database"""
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("SELECT id FROM articles WHERE url = ?", (url,))
        exists = cursor.fetchone() is not None
        
        conn.close()
        return exists
    
    def save_article(self, article: Article) -> bool:
        """Save article to database"""
        if self.article_exists(article.url):
            logger.debug(f"Article already exists: {article.url}")
            return False
        
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            # Generate UUID for article (simplified)
            import uuid
            article_id = str(uuid.uuid4())
            
            cursor.execute("""
                INSERT INTO articles (
                    id, title, description, content, url, imageUrl, author, 
                    publishedAt, feedId, categoryId, viewCount, bookmarkCount, 
                    isActive, createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1, datetime('now'), datetime('now'))
            """, (
                article_id,
                article.title,
                article.description,
                article.content,
                article.url,
                article.image_url,
                article.author,
                article.published_at,
                article.feed_id,
                article.category_id
            ))
            
            conn.commit()
            logger.info(f"Saved article: {article.title}")
            return True
            
        except sqlite3.Error as e:
            logger.error(f"Database error saving article: {str(e)}")
            conn.rollback()
            return False
        finally:
            conn.close()
    
    def update_feed_status(self, feed_id: int, success: bool, error_msg: str = None):
        """Update feed fetch status"""
        conn = self.get_db_connection()
        cursor = conn.cursor()
        
        try:
            if success:
                cursor.execute("""
                    UPDATE feeds 
                    SET lastFetched = datetime('now'), 
                        fetchCount = fetchCount + 1,
                        errorCount = 0,
                        lastError = NULL
                    WHERE id = ?
                """, (feed_id,))
            else:
                cursor.execute("""
                    UPDATE feeds 
                    SET errorCount = errorCount + 1,
                        lastError = ?,
                        updatedAt = datetime('now')
                    WHERE id = ?
                """, (error_msg, feed_id))
            
            conn.commit()
        finally:
            conn.close()
    
    async def process_feed(self, feed: Dict) -> int:
        """Process a single RSS feed"""
        logger.info(f"Processing feed: {feed['name']} ({feed['url']})")
        
        parsed_feed = await self.fetch_feed(feed['url'])
        if not parsed_feed:
            self.update_feed_status(feed['id'], False, "Failed to fetch feed")
            return 0
        
        articles_saved = 0
        
        try:
            for entry in parsed_feed.entries:
                # Extract article data
                title = self.clean_html(entry.get('title', ''))
                if not title:
                    continue
                
                url = entry.get('link', '')
                if not url:
                    continue
                
                description = self.clean_html(entry.get('description', ''))
                
                # Get content
                content = ""
                if 'content' in entry:
                    content = self.clean_html(entry.content[0].get('value', ''))
                elif 'summary' in entry:
                    content = self.clean_html(entry.get('summary', ''))
                
                # Extract image (now async)
                image_url = await self.extract_image_url_async(entry, feed['url'])
                
                # Get author
                author = entry.get('author', '') or entry.get('dc_creator', '')
                
                # Parse date
                published_date = None
                if 'published_parsed' in entry:
                    try:
                        published_date = datetime(*entry.published_parsed[:6])
                    except:
                        pass
                
                if not published_date and 'published' in entry:
                    published_date = self.parse_date(entry.get('published'))
                
                # Create article object
                article = Article(
                    title=title[:500],  # Truncate if too long
                    description=description[:1000] if description else None,
                    content=content[:5000] if content else None,  # Truncate content
                    url=url,
                    image_url=image_url,
                    author=author[:100] if author else None,
                    published_at=published_date,
                    feed_id=feed['id'],
                    category_id=feed['category_id']
                )
                
                if self.save_article(article):
                    articles_saved += 1
            
            self.update_feed_status(feed['id'], True)
            logger.info(f"Processed {feed['name']}: {articles_saved} new articles")
            
        except Exception as e:
            logger.error(f"Error processing feed {feed['name']}: {str(e)}")
            self.update_feed_status(feed['id'], False, str(e))
        
        return articles_saved
    
    async def run(self, feed_ids: List[int] = None):
        """Run the RSS parser for all or specific feeds"""
        feeds = self.get_active_feeds()
        
        if feed_ids:
            feeds = [f for f in feeds if f['id'] in feed_ids]
        
        if not feeds:
            logger.info("No feeds to process")
            return
        
        logger.info(f"Processing {len(feeds)} feeds...")
        
        total_articles = 0
        async with self:
            for feed in feeds:
                articles_count = await self.process_feed(feed)
                total_articles += articles_count
        
        logger.info(f"Completed! Total new articles: {total_articles}")

async def main():
    parser = argparse.ArgumentParser(description='NewsHub RSS Feed Parser')
    parser.add_argument('--db', default='newshub.sqlite', help='Database path')
    parser.add_argument('--feeds', nargs='+', type=int, help='Specific feed IDs to process')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose logging')
    
    args = parser.parse_args()
    
    if args.verbose:
        logging.getLogger().setLevel(logging.DEBUG)
    
    rss_parser = RSSParser(args.db)
    await rss_parser.run(args.feeds)

if __name__ == "__main__":
    asyncio.run(main())
