import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "/db/lib/postgres";
export async function POST(req) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
  }

  try {
    // Check if username exists
    const existingUser = await query("SELECT * FROM users WHERE username = $1", [username]);

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await query(
      "INSERT INTO users (username, password) VALUES ($1, $2)",
      [username, hashedPassword]
    );

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
