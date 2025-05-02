"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); 
  const [passwordStrength, setPasswordStrength] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const[showPassword,setShowPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      alert("Registration successful! Please log in.");
      router.push("/login");
    } else {
      const data = await res.json();
      alert(data.error || "Something went wrong");
    }
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Wardrobe Registration</h1>

      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-semibold text-center text-green-600">Create an Account</h2>

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
            <p
              className={`text-sm mt-1 ${
                passwordStrength === 'Weak'
                  ? 'text-red-500'
                  : passwordStrength === 'Moderate'
                  ? 'text-yellow-500'
                  : 'text-green-500'
              }`}
            >
              Password Strength: {passwordStrength}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full p-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login instead
          </Link>
        </p>
      </form>
    </div>
  );
}