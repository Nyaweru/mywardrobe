
 // lib/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';

export async function openDb() {
  const db = await open({
    filename: path.join(process.cwd(), 'wardrobe.sqlite'),
    driver: sqlite3.Database,
  });

  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS wardrobe (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      imageUrl TEXT
    );
  `);

  return db;
}
