"use client";
import React, { useState, useEffect } from "react";
import ThoughtForm from "./components/ThoughtForm";
import ThoughtList from "./components/ThoughtList";
import Spinner from "./components/Spinner";

export type Thought = {
  id: string;
  message: string;
  likes: number;
  timestamp: Date;
};

export default function App() {
  const [loading, setLoading] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);

  useEffect(() => {
    const fetchThoughts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const transformedData: Thought[] = [];

        data.forEach((item: any) => {
          transformedData.push({
            id: item._id,
            message: item.message,
            likes: item.hearts,
            timestamp: new Date(item.createdAt),
          });
        });

        setThoughts(transformedData);
      } catch (error) {
        console.error("Error fetching thoughts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThoughts();
  }, []);

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
    <div className="mx-auto max-w-md my-4 space-y-4 px-4 sm:px-4 md:px-0 lg:px-0 xl:px-0">
      <ThoughtForm onSubmit={addThought} />
      {loading ? (
        <Spinner />
      ) : (
        <ThoughtList thoughts={thoughts} onLike={handleLike} />
      )}
    </div>
  );
}
