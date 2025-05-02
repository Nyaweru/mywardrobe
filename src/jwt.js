import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

console.log("[JWT VERIFY] Using secret:", SECRET); 

if (!SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export function signJwt(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token) {
  console.log("[VERIFY JWT] Raw token input:", token); 
  try {
    const payload = jwt.verify(token, SECRET);
    console.log("[VERIFY JWT] Decoded payload:", payload); 
    return payload;
  } catch (err) {
    console.error("[VERIFY JWT] Verification failed:", err.name, "-", err.message); 
    return null;
  }
}


export default jwt;

