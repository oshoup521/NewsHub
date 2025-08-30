#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('./backend/newshub.sqlite')
cursor = conn.cursor()

print("Feeds with no articles:")
cursor.execute('''
    SELECT f.id, f.name, COUNT(a.id) as article_count 
    FROM feeds f 
    LEFT JOIN articles a ON f.id = a.feedId 
    GROUP BY f.id, f.name 
    HAVING article_count = 0
''')

rows = cursor.fetchall()
for row in rows:
    print(f'ID {row[0]}: {row[1]} - {row[2]} articles')

print("\nFeeds with articles but no images:")
cursor.execute('''
    SELECT f.id, f.name, COUNT(a.id) as total_articles,
           COUNT(CASE WHEN a.imageUrl IS NULL OR a.imageUrl = '' THEN 1 END) as no_images
    FROM feeds f 
    JOIN articles a ON f.id = a.feedId 
    GROUP BY f.id, f.name 
    HAVING COUNT(CASE WHEN a.imageUrl IS NOT NULL AND a.imageUrl != '' THEN 1 END) = 0
''')

rows = cursor.fetchall()
for row in rows:
    print(f'ID {row[0]}: {row[1]} - {row[2]} articles, {row[3]} without images')

conn.close()
