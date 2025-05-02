import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { query } from '/db/lib/postgres';

import { verifyJwt } from "@/jwt";

//  helper for authentication
async function authenticate(req) {
  const authHeader = req.headers.get("authorization");
  console.log("[AUTH] Header:", authHeader); 

  if (!authHeader) return { error: "Unauthorized", status: 401 };

  const token = authHeader.split(" ")[1];
  console.log("[AUTH] Extracted token:", token);

  const payload = verifyJwt(token);
  if (!payload) {
    console.error("[AUTH] Token verification failed");
    return { error: "Invalid Token", status: 401 };
  }

  console.log("[AUTH] Verified payload:", payload);
  return { payload };
}

export async function GET(req) {
  const { payload, error, status } = await authenticate(req);
  if (error) return NextResponse.json({ error }, { status });

  const userId = payload.userId;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const result = await query('SELECT * FROM wardrobe WHERE id = $1 AND user_id = $2', [id, userId]);
      if (result.rowCount === 0)
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      return NextResponse.json(result.rows[0]);
    } else {
      const result = await query('SELECT * FROM wardrobe WHERE user_id = $1 ORDER BY id DESC', [userId]);
      return NextResponse.json(result.rows);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(req) {
  const { payload, error, status } = await authenticate(req);
  if (error) return NextResponse.json({ error }, { status });

  const userId = payload.userId;

  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const category = formData.get("category");
    const description = formData.get("description");
    const image = formData.get("image");

    if (!image || typeof image === "string") {
      return NextResponse.json({ error: "Image is invalid" }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${Date.now()}-${image.name}`;
    const filePath = path.join(process.cwd(), "public/uploads", fileName);
    await writeFile(filePath, buffer);

    const relativePath = `/uploads/${fileName}`;
    const result = await query(
      'INSERT INTO wardrobe (name, category, description, image_path, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, description, relativePath, userId]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Create failed' }, { status: 500 });
  }
}

export async function PUT(req) {
  const { payload, error, status } = await authenticate(req);
  if (error) return NextResponse.json({ error }, { status });

  const userId = payload.userId;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const { name, category, description } = await req.json();

  try {
    const result = await query(
      'UPDATE wardrobe SET name = $1, category = $2, description = $3 WHERE id = $4 AND user_id = $5 RETURNING *',
      [name, category, description, id, userId]
    );

    if (result.rowCount === 0)
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

    
export async function DELETE(req) {
  const { payload, error, status } = await authenticate(req);
  if (error) return NextResponse.json({ error }, { status });

  const userId = payload.userId;
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const result = await query(
      "DELETE FROM wardrobe WHERE id = $1 AND user_id = $2 RETURNING *",
      [id, userId]
    );

    if (result.rowCount === 0)
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}