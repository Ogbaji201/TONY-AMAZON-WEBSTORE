"use client";

import React, { useState } from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export default function SafeImg({
  src,
  fallbackSrc = "https://via.placeholder.com/400x300/cccccc/666666?text=No+Image",
  ...props
}: Props) {
  const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

  return (
    <img
      {...props}
      src={currentSrc}
      onError={() => setCurrentSrc(fallbackSrc)}
    />
  );
}
