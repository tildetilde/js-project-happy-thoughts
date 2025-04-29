"use client";
import React, { useState } from "react";
import ThoughtForm from "./components/ThoughtForm";
import ThoughtList from "./components/ThoughtList";

export type Thought = {
  id: string;
  message: string;
  likes: number;
  timestamp: Date;
};

export default function App() {
  const [thoughts, setThoughts] = useState<Thought[]>([
    {
      id: "1",
      message: "I'm happy because we just moved into a new apartment!",
      likes: 0,
      timestamp: new Date(Date.now() - 30 * 1000), // 30 seconds ago
    },
    {
      id: "2",
      message: "It's my birthday!!!",
      likes: 10,
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
    {
      id: "3",
      message: "I'm happy because the sun is out :)",
      likes: 23,
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
  ]);

  const addThought = (message: string) => {
    const newThought: Thought = {
      id: Date.now().toString(),
      message,
      likes: 0,
      timestamp: new Date(),
    };
    setThoughts([newThought, ...thoughts]);
  };

  const handleLike = (id: string) => {
    setThoughts(
      thoughts.map((thought) =>
        thought.id === id ? { ...thought, likes: thought.likes + 1 } : thought
      )
    );
  };

  return (
    <div className="space-y-4 w-full max-w-md mx-auto">
      <ThoughtForm onSubmit={addThought} />
      <ThoughtList thoughts={thoughts} onLike={handleLike} />
    </div>
  );
}
