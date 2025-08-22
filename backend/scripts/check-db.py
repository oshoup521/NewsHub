import sqlite3

conn = sqlite3.connect('newshub.sqlite')
cursor = conn.cursor()

# Get counts
cursor.execute('SELECT COUNT(*) FROM categories')
categories_count = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM feeds') 
feeds_count = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM articles')
articles_count = cursor.fetchone()[0]

print(f"📊 NewsHub Database Statistics:")
print(f"  Categories: {categories_count}")
print(f"  Feeds: {feeds_count}")
print(f"  Articles: {articles_count}")

# Get articles by category
cursor.execute('''
    SELECT c.name, COUNT(a.id) as article_count 
    FROM categories c 
    LEFT JOIN feeds f ON f.categoryId = c.id 
    LEFT JOIN articles a ON a.feedId = f.id 
    GROUP BY c.id, c.name 
    ORDER BY article_count DESC
''')

print(f"\n📰 Articles by Category:")
for row in cursor.fetchall():
    print(f"  {row[0]}: {row[1]} articles")

conn.close()
