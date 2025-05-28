import React from "react";

type LikeCounterProps = {
  count: number;
};

function LikeCounter({ count }: LikeCounterProps) {
  return (
    <>
      <span className="sr-only">
        {count === 1 ? "1 like" : `${count} likes`}
      </span>
      <span aria-hidden="true" className="text-gray-700">
        x {count}
      </span>
    </>
  );
}

export default LikeCounter;
