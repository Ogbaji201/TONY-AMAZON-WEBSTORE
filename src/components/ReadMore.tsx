"use client";

import { useState } from "react";

export default function ReadMore({
  text,
  clamp = 4,
}: { text: string; clamp?: number }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;

  return (
    <div>
      <p className={open ? "whitespace-pre-line" : `whitespace-pre-line line-clamp-${clamp}`}>
        {text}
      </p>
      {text.length > 140 && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-2 text-blue-600 hover:underline text-sm"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
