"use client";

import React from "react";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

interface ThoughtFormProps {
  onSubmit: (message: string) => void;
  isPosting: boolean;
}

export default function ThoughtForm({ onSubmit, isPosting }: ThoughtFormProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const MAX_LENGTH = 140;
  const MIN_LENGTH = 5;

  useEffect(() => {
    if (isPosting) {
      setError(null);
    }
  }, [isPosting]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim().length < MIN_LENGTH) {
      setError(
        `Your message is too short. Please write at least ${MIN_LENGTH} characters.`
      );
      return;
    }

    if (message.length > MAX_LENGTH) {
      setError(
        `Your message is too long. Please keep it under ${MAX_LENGTH} characters.`
      );
      return;
    }

    onSubmit(message);
    setMessage("");
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (error) setError(null);
  };

  const charactersLeft = MAX_LENGTH - message.length;
  const isOverLimit = charactersLeft < 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-medium text-gray-700 mb-3">
          Is something making you happy right now?
        </h2>

        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleSubmit(e);
            }
          }}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-300 transition"
          rows={4}
          placeholder="Share your happy thought..."
          aria-label="Your happy thought"
          aria-describedby="character-counter"
          aria-invalid={isOverLimit}
        />

        <div
          id="character-counter"
          className={`text-sm ${
            isOverLimit ? "text-red-500" : "text-gray-500"
          }`}
          aria-live="polite"
        >
          {charactersLeft} characters left
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-pink-200 hover:bg-pink-300 text-gray-800 font-medium py-3 px-6 rounded-full transition flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:ring-offset-2"
          aria-label="Send happy thought"
          disabled={isPosting}
        >
          <Heart
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            aria-hidden="true"
          />
          <span>Send Happy Thought</span>
          <Heart
            className="h-5 w-5 text-red-500"
            fill="currentColor"
            aria-hidden="true"
          />
        </button>
      </form>
    </div>
  );
}
