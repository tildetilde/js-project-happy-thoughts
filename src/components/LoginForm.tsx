import React, { useState } from "react";

interface Props {
  onLogin: (token: string) => void;
}

const API = "https://happy-thoughts-api-5hw3.onrender.com";

export default function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
      } else {
        onLogin(data.token);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-white p-4 border rounded space-y-3"
    >
      <h2 className="text-xl font-semibold">Logga in</h2>
      <input
        className="w-full border p-2 rounded"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className="w-full border p-2 rounded"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        className="bg-pink-300 text-white px-4 py-2 rounded hover:bg-pink-400"
        type="submit"
      >
        Log in
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
