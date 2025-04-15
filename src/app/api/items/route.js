

import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";


const dbPromise = open({
  filename: path.join(process.cwd(), "db", "wardrobe.db"),
  driver: sqlite3.Database,
});

// GET: Fetch all items
export async function GET() {
  try {
    const db = await dbPromise;
    const items = await db.all("SELECT * FROM wardrobe");

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Error fetching items" }, { status: 500 });
  }
}

// POST: Add new item
export async function POST(request) {
  try {
    const db = await dbPromise;
    const { name, category, description, imageUrl } = await request.json();

    if (!name || !category || !description || !imageUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const result = await db.run(
      "INSERT INTO wardrobe (name, category, description, imageUrl) VALUES (?, ?, ?, ?)",
      [name, category, description, imageUrl]
    );

    return NextResponse.json({
      id: result.lastID,
      name,
      category,
      description,
      imageUrl,
    }, { status: 201 });

  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json({ error: "Error adding item" }, { status: 500 });
  }
}
/*export async function PUT(request) {
  try {
    const db = await dbPromise;
    const { id, name, category, description, imageUrl } = await request.json();

    if (!id || !name || !category || !description || !imageUrl) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const result = await db.run(
      "UPDATE wardrobe SET name = ?, category = ?, description = ?, imageUrl = ? WHERE id = ?",
      [name, category, description, imageUrl, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({
      id,
      name,
      category,
      description,
      imageUrl,
    });

  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

// Delete an item from the wardrobe
export async function DELETE(request) {
  try {
    const db = await dbPromise;
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const result = await db.run("DELETE FROM wardrobe WHERE id = ?", [id]);

    if (result.changes === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Item deleted successfully" });

  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}*/