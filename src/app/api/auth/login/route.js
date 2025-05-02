import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "@/jwt"; 
import { query } from "/db/lib/postgres";

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("JWT_SECRET is not defined in environment variables");

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    const result = await query("SELECT * FROM users WHERE username = $1", [username]);
    const user = result.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

