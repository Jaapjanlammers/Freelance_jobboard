import React from "react"

interface ButtonProps {
  children?: React.ReactNode
  className?: string
  // ...other props if needed
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}