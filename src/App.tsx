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
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);
  const [liking, setLiking] = useState<string | null>(null);

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

  const addThought = async (message: string) => {
    setPosting(true);
    setPostError(null);
    try {
      const response = await fetch(
        "https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData && errorData.error) {
          throw new Error(errorData.error);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }

      const newThoughtData = await response.json();
      const newThought: Thought = {
        id: newThoughtData._id,
        message: newThoughtData.message,
        likes: newThoughtData.hearts,
        timestamp: new Date(newThoughtData.createdAt),
      };
      setThoughts([newThought, ...thoughts]);
    } catch (error: any) {
      console.error("Error posting thought:", error);
      setPostError(error.message);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (id: string) => {
    setLiking(id);
    try {
      const response = await fetch(
        `https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts/${id}/like`,
        {
          method: "POST",
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const updatedThoughtData = await response.json();
      setThoughts((prevThoughts) =>
        prevThoughts.map((thought) =>
          thought.id === id ? { ...thought, likes: updatedThoughtData.hearts } : thought
        )
      );
    } catch (error) {
      console.error(`Error liking thought ${id}:`, error);
    } finally {
      setLiking(null);
    }
  };

  return (
    <div className="mx-auto max-w-md my-4 space-y-4 px-4 sm:px-4 md:px-0 lg:px-0 xl:px-0">
      <ThoughtForm
        onSubmit={addThought}
        isPosting={posting}
        postError={postError}
      />
      {loading ? (
        <Spinner />
      ) : (
        <ThoughtList thoughts={thoughts} onLike={handleLike} isLiking={liking}/>
      )}
    </div>
  );
}