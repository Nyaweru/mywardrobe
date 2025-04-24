
import { NextResponse } from 'next/server';

import { query } from "/db/lib/postgres";


export async function GET(request) {
  try {
    const res = await query('SELECT * FROM wardrobe', []);
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('PostgreSQL GET All Error:', error);
    return NextResponse.json(
      { error: 'Error fetching all items' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
    try {
      const { name, category, description, imageUrl } = await request.json();
  
      const result = await query(
        'INSERT INTO wardrobe (name, category, description, imageUrl) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, category, description, imageUrl]
      );
  
      return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
      console.error("POST error:", error.stack || error.message || error);

      return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
  }

  export async function PUT(request) {
    try {
      const { id, name, category, description, imageUrl } = await request.json();
  
      if (!id) {
        return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
      }
  
      const result = await query(
        'UPDATE wardrobe SET name = $1, category = $2, description = $3, imageUrl = $4 WHERE id = $5 RETURNING *',
        [name, category, description, imageUrl, id]
      );
  
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
  
      return NextResponse.json(result.rows[0]);
    } catch (error) {
      console.error('PostgreSQL PUT Error:', error);
      return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
    }
  }  
   
  export async function DELETE(request) {
    try {
      const { id } = await request.json();
  
      if (!id) {
        return NextResponse.json({ error: 'Missing item ID' }, { status: 400 });
      }
  
      const result = await query('DELETE FROM wardrobe WHERE id = $1 RETURNING *', [id]);
  
      if (result.rows.length === 0) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('PostgreSQL DELETE Error:', error);
      return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
    }
  }


