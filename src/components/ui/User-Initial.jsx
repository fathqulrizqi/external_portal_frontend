import React from "react";

export default function UserAvatar({ name, size = 10, fontSize }) {
  if (!name) return null;

  const initial = name.charAt(0).toUpperCase();
  const remSize = size * 0.25; 
  const remFontSize = fontSize ? `${fontSize}px` : "12px";

  return (
    <div
      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
      style={{ width: `${remSize}rem`, height: `${remSize}rem` }}
    >
      <span
        className="text-white font-semibold"
        style={{ fontSize: remFontSize }}
      >
        {initial}
      </span>
    </div>
  );
}
