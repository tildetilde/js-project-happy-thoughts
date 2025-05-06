import React from "react";

function Spinner() {
  return (
    <div
      className="flex justify-center items-center py-10"
      role="status"
      aria-label="Loading"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-transparent border-blue-500" />
    </div>
  );
}

export default Spinner;
