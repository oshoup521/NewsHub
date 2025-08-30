#!/usr/bin/env python3
import sqlite3

conn = sqlite3.connect('./backend/newshub.sqlite')
cursor = conn.cursor()

print("All feeds with IDs:")
cursor.execute('SELECT id, name, url FROM feeds ORDER BY id')
rows = cursor.fetchall()
for row in rows:
    print(f'ID {row[0]}: {row[1]} - {row[2]}')

conn.close()
