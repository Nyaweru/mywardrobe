// src/app/page.js
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 font-sans">
      <header className="w-full text-center">
        <h1 className="text-4xl font-bold">My Wardrobe Management System</h1>
        <p className="mt-2 text-lg">
          Manage your wardrobe with CRUD features. Choose an option below to get started.
        </p>
      </header>

      <main className="flex flex-col gap-8 items-center">
        <div className="flex flex-col sm:flex-row gap-4">
          {!isAuthenticated ? (
            <>
              <Link
                href="/register"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-sm sm:text-base h-12 px-5"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-green-500 text-white gap-2 hover:bg-green-600 font-medium text-sm sm:text-base h-12 px-5"
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/pages/wardrobe"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-blue-500 text-white gap-2 hover:bg-blue-600 font-medium text-sm sm:text-base h-12 px-5"
              >
                View Wardrobe
              </Link>
              <Link
                href="/pages/wardrobe/add"
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-green-500 text-white gap-2 hover:bg-green-600 font-medium text-sm sm:text-base h-12 px-5"
              >
                Add New Item
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-red-500 text-white gap-2 hover:bg-red-600 font-medium text-sm sm:text-base h-12 px-5"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </main>

      <footer className="w-full text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} My Wardrobe Management
        </p>
      </footer>
    </div>
  );
}

