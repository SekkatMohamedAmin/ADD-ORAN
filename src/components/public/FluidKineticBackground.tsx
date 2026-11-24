"use client";

import React from "react";

/**
 * FluidKineticBackground: Solid Pure Black Background (#000000)
 * Deepest OLED black canvas ensuring maximum contrast for white kites and red circuits.
 */
export function FluidKineticBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#000000]"
      aria-hidden="true"
    />
  );
}
