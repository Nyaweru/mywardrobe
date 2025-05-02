"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) return;
  
      const res = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.ok) {
        const redirectPath = searchParams.get("redirect") || "/wardrobe";
        router.push(redirectPath);
      } else {
        localStorage.removeItem("jwtToken"); // clean up invalid token
      }
    };
  
    verifyToken();
  }, [router, searchParams]);
  

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("jwtToken", data.token);
      const redirectPath = searchParams.get("redirect") || "/wardrobe";
      router.push(redirectPath);
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getPasswordStrength = (pwd) => {
    if (pwd.length < 6) return 'Weak';
    if (/[A-Za-z]/.test(pwd) && /\d/.test(pwd) && pwd.length >= 8) return 'Strong';
    return 'Moderate';
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    setPasswordStrength(getPasswordStrength(val));
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Wardrobe Login Page</h1>

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-semibold text-center text-green-600">Login</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-2 top-2 text-sm text-blue-500"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {password && (
            <p className={`text-sm mt-1 ${passwordStrength === 'Weak' ? 'text-red-500' : passwordStrength === 'Moderate' ? 'text-yellow-500' : 'text-green-500'}`}>
              Password Strength: {passwordStrength}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
}