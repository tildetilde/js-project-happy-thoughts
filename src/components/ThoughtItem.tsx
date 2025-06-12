import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import type { Thought } from "../App";
import LikeCounter from "./LikeCounter";

const loveSound = "/heartbeat.wav";

interface ThoughtItemProps {
  thought: Thought;
  isNew: boolean;
  onLike: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newMessage: string) => void;
  formatTimestamp: (date: Date) => string;
}

export default function ThoughtItem({
  thought,
  isNew,
  onLike,
  onDelete,
  onEdit,
  formatTimestamp,
}: ThoughtItemProps) {
  const [animate, setAnimate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMessage, setEditMessage] = useState(thought.message);

  const MAX_LENGTH = 140;
  const MIN_LENGTH = 5;
  const charactersLeft = MAX_LENGTH - editMessage.length;
  const isOverLimit = charactersLeft < 0;
  const isTooShort = editMessage.trim().length < MIN_LENGTH;

  useEffect(() => {
    setEditMessage(thought.message);
  }, [thought.message]);

  const handleClick = () => {
    onLike(thought.id);
    setAnimate(true);
    const audio = new Audio(loveSound);
    audio.volume = 0.2;
    audio.play();
    setTimeout(() => setAnimate(false), 600);
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-pop-br hover:!-translate-x-2 hover:!-translate-y-2 ${
        isNew ? "animate-fade-in" : ""
      }`}
    >
      {isEditing ? (
        <div className="mb-4">
          <div
            className={`text-sm ${
              isOverLimit || isTooShort ? "text-red-500" : "text-gray-700"
            }`}
            aria-live="polite"
          >
            {charactersLeft} characters left
          </div>

          {isTooShort && (
            <div className="mt-1 p-2 bg-red-50 text-red-600 rounded-md text-sm">
              Your message is too short. Please write at least {MIN_LENGTH}{" "}
              characters.
            </div>
          )}

          {isOverLimit && (
            <div className="mt-1 p-2 bg-red-50 text-red-600 rounded-md text-sm">
              Your message is too long. Please keep it under {MAX_LENGTH}{" "}
              characters.
            </div>
          )}

          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (!isTooShort && !isOverLimit) {
                  onEdit(thought.id, editMessage);
                  setIsEditing(false);
                }
              }
              if (e.key === "Escape") {
                e.preventDefault();
                setIsEditing(false);
                setEditMessage(thought.message);
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              onClick={() => {
                onEdit(thought.id, editMessage);
                setIsEditing(false);
              }}
              disabled={isTooShort || isOverLimit}
              className={`text-sm px-3 py-1 rounded-full ${
                isTooShort || isOverLimit
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-green-200 hover:bg-green-300"
              }`}
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditMessage(thought.message);
              }}
              className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-full"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-lg text-gray-800 mb-4 font-['Courier_New'] font-medium text-pretty">
          {thought.message}
        </p>
      )}

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

        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="transition-transform duration-200 hover:scale-110 hover:text-red-600 focus:outline-none animate-fade-in"
              aria-label="Edit this thought"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                stroke="#333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="edit-icon"
              >
                <path d="M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z" />
                <path d="M15 5.5l3.5 3.5" />
              </svg>
            </button>
          )}

          <button
            onClick={() => onDelete(thought.id)}
            className="transition-transform duration-200 hover:scale-110 hover:text-red-600 focus:outline-none animate-fade-in"
            aria-label="Delete this thought"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
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
    </div>
  );
}
