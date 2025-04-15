import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export async function PUT(request) {
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
      message: "Item updated successfully",
      item: { id, name, category, description, imageUrl },
    });

  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Error updating item" }, { status: 500 });
  }
}

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

    return NextResponse.json({ message: "Item deleted successfully", deletedId: id });

  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }
}



