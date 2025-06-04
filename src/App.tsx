"use client";
import React, { useState, useEffect } from "react";
import ThoughtForm from "./components/ThoughtForm";
import ThoughtList from "./components/ThoughtList";
import Spinner from "./components/Spinner";
import MyLikedThoughts from "./components/MyLikedThoughts";
import plingSound from "/ding.wav";

export type Thought = {
  id: string;
  message: string;
  likes: number;
  timestamp: Date;
};

const API_BASE = "https://happy-thoughts-api-5hw3.onrender.com";

export default function App() {
  const [loading, setLoading] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [likedThoughtIds, setLikedThoughtIds] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchThoughts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/thoughts`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const transformedData: Thought[] = [];

        data.thoughts.forEach((item: any) => {
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

    const stored = localStorage.getItem("likedThoughts");
    if (stored) {
      setLikedThoughtIds(JSON.parse(stored));
    }
  }, []);

  const addThought = async (message: string) => {
    setPosting(true);
    try {
      const response = await fetch(`${API_BASE}/thoughts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
      } else {
        const newThoughtData = await response.json();
        const newThought: Thought = {
          id: newThoughtData._id,
          message: newThoughtData.message,
          likes: newThoughtData.hearts,
          timestamp: new Date(newThoughtData.createdAt),
        };
        setThoughts([newThought, ...thoughts]);

        const audio = new Audio(plingSound);
        audio.volume = 0.2;
        audio.play();
      }
    } catch (error: any) {
      console.error("Error posting thought:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/thoughts/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Ta bort från state om lyckat
      setThoughts((prev) => prev.filter((thought) => thought.id !== id));
    } catch (error) {
      console.error("Failed to delete thought", error);
    }
  };

  const handleLike = async (id: string) => {
    setThoughts((prev) =>
      prev.map((thought) =>
        thought.id === id ? { ...thought, likes: thought.likes + 1 } : thought
      )
    );

    try {
      await fetch(`${API_BASE}/thoughts/${id}/like`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to send like to API", error);
    }

    setLikedThoughtIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("likedThoughts", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="mx-auto max-w-md my-4 space-y-4 px-4 sm:px-4 md:px-0 lg:px-0 xl:px-0">
      <ThoughtForm onSubmit={addThought} isPosting={posting} />
      {loading ? (
        <Spinner />
      ) : (
        <>
          <ThoughtList
            thoughts={thoughts}
            onLike={handleLike}
            onDelete={handleDelete}
          />
          <MyLikedThoughts
            thoughts={thoughts}
            likedThoughtIds={likedThoughtIds}
          />
        </>
      )}
    </div>
  );
}
