import React, { useState } from "react";
import { Heart } from "lucide-react";
import type { Thought } from "../App";
import LikeCounter from "./LikeCounter";
import loveSound from "/heartbeat.wav";

interface ThoughtItemProps {
  thought: Thought;
  isNew: boolean;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  formatTimestamp: (date: Date) => string;
}

export default function ThoughtItem({
  thought,
  isNew,
  onLike,
  onDelete,
  formatTimestamp,
}: ThoughtItemProps) {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    onLike(thought.id);
    setAnimate(true);
    const audio = new Audio(loveSound);
    audio.volume = 0.2;
    audio.play();
    setTimeout(() => setAnimate(false), 600); // matcha animationens längd
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-pop-br hover:!-translate-x-2 hover:!-translate-y-2 ${
        isNew ? "animate-fade-in" : ""
      }`}
    >
      <p className="text-lg text-gray-800 mb-4 font-['Courier_New'] font-medium text-pretty">
        {thought.message}
      </p>
      <div className="flex justify-between items-center">
        <button
          onClick={handleClick}
          className="flex items-center gap-2"
          aria-label={`Like this thought. Currently has ${thought.likes} likes`}
        >
          <div
            className={`p-3 rounded-full ${
              thought.likes > 0 ? "bg-pink-200" : "bg-gray-200"
            }`}
          >
            <Heart
              className={`h-5 w-5 transition-transform duration-300 ${
                thought.likes > 0 ? "text-red-500" : "text-gray-700"
              } ${animate ? "animate-heartbeat" : ""}`}
              fill="currentColor"
              aria-hidden="true"
            />
          </div>
          <LikeCounter count={thought.likes} />
        </button>
        <span
          className="text-gray-700 text-sm"
          aria-label={`Posted ${formatTimestamp(thought.timestamp)}`}
        >
          {formatTimestamp(thought.timestamp)}
        </span>
        <button
          onClick={() => onDelete(thought.id)}
          className="ml-2 transition-transform duration-200 hover:scale-110 hover:text-red-600 focus:outline-none animate-fade-in"
          aria-label="Delete this thought"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="trash-icon"
          >
            <rect x="6" y="7" width="12" height="13" rx="2" />
            <path d="M9 7V4h6v3" />
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="16" />
            <line x1="14" y1="11" x2="14" y2="16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
