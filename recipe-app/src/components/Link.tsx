"use client";

import { ReactNode } from "react";

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export default function Link({
  href,
  children,
  className = "",
  target = "_blank",
  rel = "noopener noreferrer",
}: LinkProps) {
  return (
    <a href={href} target={target} rel={rel} className={className}>
      {children}
    </a>
  );
}
