import React from "react";
import { Thought } from "../App";

type MyLikedThoughtsProps = {
  likedThoughtIds: string[];
  thoughts: Thought[];
};

export default function MyLikedThoughts({
  likedThoughtIds = [],
  thoughts = [],
}: MyLikedThoughtsProps) {
  const likedThoughts = thoughts.filter((t) => likedThoughtIds.includes(t.id));

  return (
    <div className="text-center text-sm text-gray-700" aria-live="polite">
      You’ve liked {likedThoughts.length}{" "}
      {likedThoughts.length === 1 ? "thought" : "thoughts"}
    </div>
  );
}
