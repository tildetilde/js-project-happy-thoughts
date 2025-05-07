import React from "react";
import { Heart } from "lucide-react";
import type { Thought } from "../App";
import LikeCounter from "./LikeCounter";
import { useEffect } from "react";

interface ThoughtItemProps {
  thought: Thought;
  isNew: boolean;
  onLike: (id: string) => Promise<void>;
  formatTimestamp: (date: Date) => string;
  isLiking: string | null;
}

export default function ThoughtItem({
  thought,
  isNew,
  onLike,
  formatTimestamp,
  isLiking,
}: ThoughtItemProps) {
  const handleLikeClick = () => {
    onLike(thought.id);
  };

  const isCurrentlyLiking = isLiking === thought.id;

  useEffect(() => {
    return () => {
    };
  }, [thought.id]); // Only run on mount and unmount based on thought.id


  return (
    <div
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
          onClick={handleLikeClick}
          className="flex items-center gap-2"
          aria-label={`Like this thought. Currently has ${thought.likes} likes`}
          disabled={isCurrentlyLiking}
        >
          <div
            className={`p-3 rounded-full transition-colors ${
              isCurrentlyLiking ? "bg-pink-300 animate-pulse" : thought.likes > 0 ? "bg-pink-200" : "bg-gray-200"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${
                thought.likes > 0 ? "text-red-500" : "text-gray-500"
              }`}
              fill="currentColor"
              aria-hidden="true"
            />
          </div>
          <LikeCounter count={thought.likes} />
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
}