#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('./backend/newshub.sqlite')
cursor = conn.cursor()

print("Recent TechCrunch articles WITH images:")
cursor.execute('''
    SELECT title, imageUrl 
    FROM articles 
    WHERE feedId = 1 AND imageUrl IS NOT NULL AND imageUrl != ''
    ORDER BY createdAt DESC 
    LIMIT 5
''')

rows = cursor.fetchall()
if rows:
    for row in rows:
        print(f'{row[0][:60]}... - {row[1][:100]}...')
else:
    print("No TechCrunch articles with images found")

print("\nLatest TechCrunch articles (including those without images):")
cursor.execute('''
    SELECT title, imageUrl, createdAt
    FROM articles 
    WHERE feedId = 1
    ORDER BY createdAt DESC 
    LIMIT 5
''')

rows = cursor.fetchall()
for row in rows:
    image_status = "HAS IMAGE" if row[1] else "NO IMAGE"
    print(f'{row[0][:60]}... - {image_status} - {row[2]}')

conn.close()
