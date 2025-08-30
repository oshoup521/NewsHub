#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('./backend/newshub.sqlite')
cursor = conn.cursor()

print("Image statistics by category:")
cursor.execute("""
    SELECT c.name as category, 
           COUNT(CASE WHEN a.imageUrl IS NOT NULL AND a.imageUrl != '' THEN 1 END) as with_images, 
           COUNT(a.id) as total 
    FROM articles a 
    JOIN categories c ON a.categoryId = c.id 
    GROUP BY c.id, c.name 
    ORDER BY c.name
""")

rows = cursor.fetchall()
for row in rows:
    category, with_images, total = row
    percentage = (100 * with_images / total) if total > 0 else 0
    print(f"{category}: {with_images} with images / {total} total articles ({percentage:.1f}%)")

print("\nSample articles with images by category:")
cursor.execute("""
    SELECT c.name as category, a.title, a.imageUrl
    FROM articles a 
    JOIN categories c ON a.categoryId = c.id 
    WHERE a.imageUrl IS NOT NULL AND a.imageUrl != ''
    ORDER BY c.name, a.createdAt DESC
    LIMIT 5
""")

rows = cursor.fetchall()
for row in rows:
    category, title, image_url = row
    print(f"{category}: {title[:60]}...")
    print(f"  Image: {image_url[:100]}...")
    print()

print("Sample articles WITHOUT images by category:")
cursor.execute("""
    SELECT c.name as category, a.title, f.name as feed_name
    FROM articles a 
    JOIN categories c ON a.categoryId = c.id 
    JOIN feeds f ON a.feedId = f.id
    WHERE a.imageUrl IS NULL OR a.imageUrl = ''
    ORDER BY c.name, a.createdAt DESC
    LIMIT 10
""")

rows = cursor.fetchall()
for row in rows:
    category, title, feed_name = row
    print(f"{category}: {title[:60]}... (from {feed_name})")

conn.close()
