"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface LazyImageProps extends Omit<ImageProps, "onLoad"> {
  wrapperClassName?: string;
}

export function LazyImage({
  src,
  alt,
  wrapperClassName = "",
  className = "",
  fill,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // When `fill` is used, the wrapper must span the full parent area
  // so the absolutely-positioned Image inside can render at full size.
  const fillStyles = fill
    ? "absolute inset-0"
    : "relative";

  return (
    <div className={`overflow-hidden bg-[#0A0A0D] ${fillStyles} ${wrapperClassName}`}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        className={`transition-all duration-1000 ease-out ${
          isLoaded
            ? "opacity-100 scale-100 blur-0"
            : "opacity-0 scale-[1.03] blur-sm"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  );
}
