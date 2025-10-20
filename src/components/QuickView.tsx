"use client";

import { useState } from "react";

export default function QuickView({
  title,
  text,
  buttonLabel = "Read more",
  className = "",
}: {
  title: string;
  text: string;
  buttonLabel?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!text) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className || "mt-1 text-blue-600 hover:underline text-sm"}
      >
        {buttonLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          {/* dialog */}
          <div className="relative bg-white w-[92vw] max-w-xl max-h-[80vh] rounded-2xl shadow-2xl p-6 overflow-y-auto">
            <h3 className="text-xl font-semibold mb-3">{title}</h3>
            <p className="whitespace-pre-line text-gray-700 leading-relaxed">
              {text}
            </p>

            <div className="mt-6 text-right">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
