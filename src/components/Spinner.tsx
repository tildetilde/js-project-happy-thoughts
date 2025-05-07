import React from "react";
import { Heart } from "lucide-react";

function Spinner() {
  const placeholders = Array.from({ length: 3 });

  return (
    <div
      className="mx-auto w-full max-w-md space-y-4"
      role="status"
      aria-label="Loading thoughts"
    >
      {placeholders.map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-lg border border-pink-200 bg-white p-4 shadow-sm"
        >
          <div className="flex space-x-4">
            <div className="h-10 w-10 rounded-full bg-pink-100" />
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 rounded bg-pink-100" />
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-2 rounded bg-pink-100" />
                  <div className="col-span-1 h-2 rounded bg-pink-100" />
                </div>
                <div className="h-2 rounded bg-pink-100" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Spinner;
