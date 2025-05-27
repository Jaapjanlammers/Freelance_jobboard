import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return <span className={className}>{children}</span>;
}

export default Badge;