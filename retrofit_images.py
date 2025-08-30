#!/usr/bin/env python3
"""
Image Retrofit Script for NewsHub
Updates existing articles without images by trying to extract them using enhanced methods
"""

import sqlite3
import asyncio
import aiohttp
import logging
import re
from urllib.parse import urlparse, urljoin
from typing import Optional

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class ImageRetrofitter:
    def __init__(self, db_path: str = "./backend/newshub.sqlite"):
        self.db_path = db_path
        self.session = None
        
    async def __aenter__(self):
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={'User-Agent': 'NewsHub Image Retrofitter 1.0'}
        )
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()

    def get_articles_without_images(self, limit: int = 10) -> list:
        """Get articles that don't have images"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT a.id, a.title, a.url, f.name as feed_name, f.url as feed_url
            FROM articles a
            JOIN feeds f ON a.feedId = f.id
            WHERE (a.imageUrl IS NULL OR a.imageUrl = '')
            AND f.name IN ('TechCrunch', 'The Verge', 'Science Daily', 'ESPN', 'Hacker News')
            ORDER BY a.createdAt DESC
            LIMIT ?
        """, (limit,))
        
        articles = cursor.fetchall()
        conn.close()
        return articles

    def update_article_image(self, article_id: str, image_url: str) -> bool:
        """Update article with image URL"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        try:
            cursor.execute("""
                UPDATE articles 
                SET imageUrl = ?, updatedAt = datetime('now')
                WHERE id = ?
            """, (image_url, article_id))
            
            conn.commit()
            return cursor.rowcount > 0
        except Exception as e:
            logger.error(f"Error updating article {article_id}: {str(e)}")
            return False
        finally:
            conn.close()

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

    async def extract_image_from_article_page(self, article_url: str, feed_name: str) -> Optional[str]:
        """Extract image from article page based on site-specific patterns"""
        try:
            async with self.session.get(article_url) as response:
                if response.status != 200:
                    return None
                
                content = await response.text()
                
                # Common meta tag patterns that work for most sites
                meta_patterns = [
                    r'<meta property="og:image" content="([^"]+)"',
                    r'<meta name="twitter:image" content="([^"]+)"',
                    r'<meta property="twitter:image" content="([^"]+)"',
                    r'<meta name="twitter:image:src" content="([^"]+)"',
                ]
                
                # Site-specific patterns
                if 'techcrunch.com' in article_url.lower():
                    site_patterns = [
                        r'<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+)"',
                        r'<img[^>]+class="[^"]*featured-image[^"]*"[^>]+src="([^"]+)"',
                        r'<img[^>]+data-src="([^"]+)"[^>]*class="[^"]*featured[^"]*"',
                    ]
                elif 'theverge.com' in article_url.lower():
                    site_patterns = [
                        r'<img[^>]+data-original="([^"]+)"',
                        r'<img[^>]+class="[^"]*duet--article--lede-image[^"]*"[^>]+src="([^"]+)"',
                        r'<source[^>]+srcset="([^"\s]+)"[^>]*media="[^"]*min-width',
                    ]
                elif 'sciencedaily.com' in article_url.lower():
                    site_patterns = [
                        r'<img[^>]+id="story_image"[^>]+src="([^"]+)"',
                        r'<img[^>]+class="[^"]*story-image[^"]*"[^>]+src="([^"]+)"',
                        r'<img[^>]+alt="[^"]*"[^>]+src="([^"]+)"[^>]*width="[^"]*"[^>]*height="[^"]*"',
                    ]
                elif 'espn.com' in article_url.lower():
                    site_patterns = [
                        r'<img[^>]+class="[^"]*media-wrapper_image[^"]*"[^>]+src="([^"]+)"',
                        r'<picture[^>]*>.*?<img[^>]+src="([^"]+)"',
                    ]
                else:
                    site_patterns = []
                
                # Try all patterns
                all_patterns = meta_patterns + site_patterns
                
                for pattern in all_patterns:
                    match = re.search(pattern, content, re.IGNORECASE | re.DOTALL)
                    if match:
                        image_url = match.group(1)
                        # Clean up the URL
                        if image_url.startswith('//'):
                            image_url = 'https:' + image_url
                        elif image_url.startswith('/'):
                            parsed_url = urlparse(article_url)
                            image_url = f"{parsed_url.scheme}://{parsed_url.netloc}{image_url}"
                        
                        if self.is_valid_image_url(image_url):
                            return image_url
                
        except Exception as e:
            logger.debug(f"Error extracting image from {article_url}: {str(e)}")
        
        return None

    async def process_articles(self, limit: int = 20):
        """Process articles without images and try to find images for them"""
        articles = self.get_articles_without_images(limit)
        
        if not articles:
            logger.info("No articles without images found")
            return
        
        logger.info(f"Processing {len(articles)} articles without images...")
        
        updated_count = 0
        
        async with self:
            for article_id, title, article_url, feed_name, feed_url in articles:
                logger.info(f"Processing: {title[:60]}... from {feed_name}")
                
                image_url = await self.extract_image_from_article_page(article_url, feed_name)
                
                if image_url:
                    if self.update_article_image(article_id, image_url):
                        logger.info(f"✅ Added image: {image_url[:80]}...")
                        updated_count += 1
                    else:
                        logger.error(f"❌ Failed to update article {article_id}")
                else:
                    logger.debug(f"❌ No image found for: {title[:60]}...")
                
                # Small delay to be respectful
                await asyncio.sleep(1)
        
        logger.info(f"Completed! Updated {updated_count} articles with images")

async def main():
    retrofitter = ImageRetrofitter()
    await retrofitter.process_articles(limit=30)  # Process 30 articles

if __name__ == "__main__":
    asyncio.run(main())
