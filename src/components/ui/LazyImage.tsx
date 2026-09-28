"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Fallback: If image is already cached or completed before React hydration,
  // mark as loaded immediately so it never stays in an intermediate state.
  useEffect(() => {
    if (imgRef.current && (imgRef.current.complete || imgRef.current.naturalWidth > 0)) {
      setIsLoaded(true);
    }
  }, [src]);

  // When `fill` is used, the wrapper must span the full parent area
  // so the absolutely-positioned Image inside can render at full size.
  const fillStyles = fill
    ? "absolute inset-0"
    : "relative";

  return (
    <div className={`overflow-hidden bg-[#0A0A0D] ${fillStyles} ${wrapperClassName}`}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill={fill}
        unoptimized
        className={`transition-opacity duration-500 ease-out ${
          isLoaded ? "opacity-100" : "opacity-95"
        } ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)} // Fail-safe: never hide image if error occurs
        {...props}
      />
    </div>
  );
}
