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

export default function App() {
  const [loading, setLoading] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [likedThoughtIds, setLikedThoughtIds] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchThoughts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://happy-thoughts-api-4ful.onrender.com/thoughts"
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
    // När användaren kommer tillbaka eller laddar om, ska appen läsa från localStorage för att veta vilka inlägg som redan gillats.
    const stored = localStorage.getItem("likedThoughts");
    if (stored) {
      setLikedThoughtIds(JSON.parse(stored));
    }
  }, []);

  const addThought = async (message: string) => {
    setPosting(true);
    try {
      const response = await fetch(
        "https://happy-thoughts-api-4ful.onrender.com/thoughts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

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

  const handleLike = async (id: string) => {
    // Optimistisk uppdatering av likes i state
    setThoughts((prev) =>
      prev.map((thought) =>
        thought.id === id ? { ...thought, likes: thought.likes + 1 } : thought
      )
    );

    // Uppdatera API
    try {
      await fetch(
        `https://happy-thoughts-api-4ful.onrender.com/thoughts/${id}/like`,
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error("Failed to send like to API", error);
    }

    // Lägg till ID i likedThoughtIds state OCH localStorage
    setLikedThoughtIds((prev) => {
      if (prev.includes(id)) return prev;
      // När en användare klickar på hjärtat, ska id:t för det inlägget sparas lokalt i webbläsaren.
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
          <ThoughtList thoughts={thoughts} onLike={handleLike} />
          <MyLikedThoughts
            thoughts={thoughts}
            likedThoughtIds={likedThoughtIds}
          />
        </>
      )}
    </div>
  );
}
