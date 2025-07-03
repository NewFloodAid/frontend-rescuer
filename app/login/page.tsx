"use client"; // Add this to make it a client component

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login, isAuthenticated } from "@/api/login";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace("/main");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await login(username, password);

    if (result.success) {
      router.push("/main");
    } else {
      setError(result.message || "Invalid username or password");
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center"
      style={{
        backgroundImage: "url('/images/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mt-[18vh] flex flex-col items-center">
        <h1 className="text-white text-[8vw] font-bold mb-8">ONSPOT</h1>

        {/* Error Alert Box */}
{error && (
  <div className="w-full bg-red-200 text-red-700 text-center py-2 px-4 mb-4 border-2 border-red-700 shadow-md">
    {error}
  </div>
)}

        <form onSubmit={handleSubmit} className="space-y-6 w-full">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full py-3 px-4 text-gray-700 rounded-xl shadow focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full py-3 px-4 text-gray-700 rounded-xl shadow focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-white text-black font-bold rounded-xl shadow-md hover:bg-gray-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
