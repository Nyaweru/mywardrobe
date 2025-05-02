import { NextResponse } from "next/server";
import { verifyJwt } from "@/jwt";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyJwt(token);

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pages/wardrobe/:path*",
    "/pages/wardrobe/add",
  ],
};
