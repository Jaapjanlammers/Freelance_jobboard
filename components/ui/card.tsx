import React from "react"

interface MyComponentProps {
  children: React.ReactNode
  className?: string
}

export function MyComponent({ children, className }: MyComponentProps) {
  return <div className={className}>{children}</div>
}
