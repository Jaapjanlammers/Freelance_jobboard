import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
  children?: React.ReactNode
}

export const Button = ({ className, children, ...props }: ButtonProps) => (
  <button className={className} {...props}>
    {children}
  </button>
)