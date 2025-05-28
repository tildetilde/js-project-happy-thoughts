import React, { useState } from "react";
import type { Thought } from "../App";
import ThoughtItem from "./ThoughtItem";

interface ThoughtListProps {
  thoughts: Thought[];
  onLike: (id: string) => void;
}

export default function ThoughtList({ thoughts, onLike }: ThoughtListProps) {
  const [newThoughts, setNewThoughts] = useState<Set<string>>(new Set());

  // Add animation to new thoughts
  const handleNewThought = (id: string) => {
    if (!newThoughts.has(id)) {
      setNewThoughts(new Set(newThoughts).add(id));
      setTimeout(() => {
        setNewThoughts((prev) => {
          const updated = new Set(prev);
          updated.delete(id);
          return updated;
        });
      }, 2000);
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minute${
        Math.floor(diffInSeconds / 60) > 1 ? "s" : ""
      } ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour${
        Math.floor(diffInSeconds / 3600) > 1 ? "s" : ""
      } ago`;
    return `${Math.floor(diffInSeconds / 86400)} day${
      Math.floor(diffInSeconds / 86400) > 1 ? "s" : ""
    } ago`;
  };

  return (
    <div className="space-y-4" aria-label="Happy thoughts">
      {thoughts.map((thought) => {
        const isNew = newThoughts.has(thought.id);
        if (thought === thoughts[0] && !newThoughts.has(thought.id)) {
          handleNewThought(thought.id);
        }

        return (
          <ThoughtItem
            key={thought.id}
            thought={thought}
            isNew={isNew}
            onLike={onLike}
            formatTimestamp={formatTimestamp}
          />
        );
      })}
    </div>
  );
}
