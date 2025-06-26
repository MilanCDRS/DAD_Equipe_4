// src/components/BreezyLogo.js

import React from "react";

/**
 * BreezyLogo
 * Un composant SVG réutilisable qui accepte width, height et className.
 * Defaults: width=24, height=24.
 */
export default function BreezyLogo({
  width = 24,
  height = 24,
  className = "",
  fill = "none",
  stroke = "black",
  strokeWidth = 2,
  strokeLinecap = "round",
  viewBox = "0 0 64 64",
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      className={className}
    >
      <path d="M8 20h24a6 6 0 1 0-6-6" />
      <path d="M8 32h40a6 6 0 1 0-6-6" />
      <path d="M8 44h24a6 6 0 1 1-6 6" />
    </svg>
  );
}
