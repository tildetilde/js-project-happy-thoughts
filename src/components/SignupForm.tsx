import React, { useState } from "react";

interface Props {
  onSignup: (token: string) => void;
}

const API = "https://happy-thoughts-api-5hw3.onrender.com";

export default function SignupForm({ onSignup }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
      } else {
        localStorage.setItem("token", data.token);
        onSignup(data.token);
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={handleSignup}
      className="bg-white p-4 border rounded space-y-3"
    >
      <h2 className="text-xl font-semibold">Create Account</h2>
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
        placeholder="Password (minimum 8 characters)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        type="submit"
      >
        Create Account
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
