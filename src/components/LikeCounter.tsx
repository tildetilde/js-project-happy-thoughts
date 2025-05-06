import React from "react";

type LikeCounterProps = {
  count: number;
};

function LikeCounter({ count }: LikeCounterProps) {
  return (
    <span
      className="text-gray-500"
      aria-label={`This thought has ${count} ${count === 1 ? "like" : "likes"}`}
    >
      x {count}
    </span>
  );
}

export default LikeCounter;
