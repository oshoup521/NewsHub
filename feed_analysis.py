#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('./backend/newshub.sqlite')
cursor = conn.cursor()

print("Feed analysis by category:")
cursor.execute("""
    SELECT c.name as category, 
           f.name as feed_name,
           f.url,
           COUNT(a.id) as total_articles,
           COUNT(CASE WHEN a.imageUrl IS NOT NULL AND a.imageUrl != '' THEN 1 END) as with_images
    FROM categories c 
    LEFT JOIN feeds f ON c.id = f.categoryId
    LEFT JOIN articles a ON f.id = a.feedId
    WHERE f.isActive = 1
    GROUP BY c.id, f.id
    ORDER BY c.name, f.name
""")

rows = cursor.fetchall()
for row in rows:
    category, feed_name, url, total, with_images = row
    percentage = (100 * with_images / total) if total > 0 else 0
    print(f"\n{category} -> {feed_name}")
    print(f"  URL: {url}")
    print(f"  Articles: {total}, With images: {with_images} ({percentage:.1f}%)")

conn.close()
