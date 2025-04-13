// src/utils/formatHelpers.js
import React from "react";

export const formatDetails = (details) => {
  if (!details) return "-";
  try {
    const parsed = typeof details === "object" ? details : JSON.parse(details);
    const keys = Object.keys(parsed);

    if (keys.length === 0) return "-";

    return (
      <div className="max-w-xs overflow-hidden text-xs">
        {keys.map((key) => (
          <div key={key} className="truncate">
            <span className="font-medium text-blue-400">{key}:</span>{" "}
            <span className="text-gray-300">
              {JSON.stringify(parsed[key]).substring(0, 30)}
            </span>
          </div>
        ))}
      </div>
    );
  } catch (e) {
    return String(details).substring(0, 50);
  }
};
