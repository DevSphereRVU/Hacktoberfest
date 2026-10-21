"use client";

import { useState } from "react";

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function fallback(name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#203c36"/><text x="50" y="62" font-family="monospace" font-size="38" font-weight="700" fill="#f5b726" text-anchor="middle">${initials(name)}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function Avatar({ src, name, className = "avatar", lazy = false }) {
  const [failed, setFailed] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src={failed ? fallback(name) : src}
      alt={`Photo of ${name}`}
      loading={lazy ? "lazy" : undefined}
      onError={() => setFailed(true)}
    />
  );
}
