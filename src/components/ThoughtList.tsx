"use client";

import React from "react";

import { useState } from "react";
import { Heart } from "lucide-react";
import { type Thought } from "../App";

interface ThoughtListProps {
  thoughts: Thought[];
  onLike: (id: string) => void;
}

export default function ThoughtList({ thoughts, onLike }: ThoughtListProps) {
  const [newThoughts, setNewThoughts] = useState<Set<string>>(new Set());

  // Add animation for new thoughts
  const handleNewThought = (id: string) => {
    if (!newThoughts.has(id)) {
      setNewThoughts(new Set(newThoughts).add(id));
      setTimeout(() => {
        setNewThoughts((prev) => {
          const updated = new Set(prev);
          updated.delete(id);
          return updated;
        });
      }, 2000); // Remove the animation class after 2 seconds
    }
  };

  // Format the timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="space-y-4" role="feed" aria-label="Thankful thoughts">
      {thoughts.map((thought) => {
        // Check if this is a new thought to apply animation
        const isNew = newThoughts.has(thought.id);

        // When a new thought is added, trigger the animation
        if (thought === thoughts[0] && !newThoughts.has(thought.id)) {
          handleNewThought(thought.id);
        }

        return (
          <div
            key={thought.id}
            className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all duration-500 ${
              isNew ? "animate-fade-in" : ""
            }`}
            style={{
              boxShadow:
                "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
            }}
          >
            <p className="text-lg text-gray-800 mb-4 font-['Courier_New'] font-medium text-pretty">
              {thought.message}
            </p>
            <div className="flex justify-between items-center">
              <button
                onClick={() => onLike(thought.id)}
                className="flex items-center gap-2"
                aria-label={`Like this thought. Currently has ${thought.likes} likes`}
              >
                <div
                  className={`p-3 rounded-full ${
                    thought.likes > 0 ? "bg-pink-200" : "bg-gray-200"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      thought.likes > 0 ? "text-red-500" : "text-gray-500"
                    }`}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                </div>
                <span className="text-gray-500">x {thought.likes}</span>
              </button>
              <span
                className="text-gray-400 text-sm"
                aria-label={`Posted ${formatTimestamp(thought.timestamp)}`}
              >
                {formatTimestamp(thought.timestamp)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
