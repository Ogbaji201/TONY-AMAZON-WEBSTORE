// "use client";

// import { useState } from "react";

// export default function ReadMore({
//   text,
//   clamp = 4,
// }: { text: string; clamp?: number }) {
//   const [open, setOpen] = useState(false);
//   if (!text) return null;

//   return (
//     <div>
//       <p className={open ? "whitespace-pre-line" : `whitespace-pre-line line-clamp-${clamp}`}>
//         {text}
//       </p>
//       {text.length > 140 && (
//         <button
//           onClick={() => setOpen((v) => !v)}
//           className="mt-2 text-blue-600 hover:underline text-sm"
//         >
//           {open ? "Show less" : "Read more"}
//         </button>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";

// FIX: Tailwind purges dynamic classes like `line-clamp-${clamp}` at build time.
// We use a static lookup map instead so all classes are explicit strings.
const clampClass: Record<number, string> = {
  2: "line-clamp-2",
  3: "line-clamp-3",
  4: "line-clamp-4",
  5: "line-clamp-5",
  6: "line-clamp-6",
};

export default function ReadMore({
  text,
  clamp = 4,
}: {
  text: string;
  clamp?: number;
}) {
  const [open, setOpen] = useState(false);
  if (!text) return null;

  return (
    <div>
      <p
        className={
          open
            ? "whitespace-pre-line text-sm text-gray-600 leading-relaxed"
            : `whitespace-pre-line text-sm text-gray-600 leading-relaxed ${clampClass[clamp] ?? "line-clamp-4"}`
        }
      >
        {text}
      </p>
      {text.length > 140 && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-2 text-blue-600 hover:underline text-sm font-medium"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
