"use client";

import AuthCard from "../../components/AuthCard";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
  };

  return (
    <AuthCard
      title="Login to ZEAL"
      footerText="Don't have an account?"
      footerLink="/register"
      footerLinkText="Register"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F2994A] focus:outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#F2994A] focus:outline-none"
      />
      <button
        onClick={handleLogin}
        className="w-full bg-[#6C63FF] text-white py-2 rounded-lg hover:bg-[#5750d9] transition"
      >
        Login
      </button>
    </AuthCard>
  );
}
