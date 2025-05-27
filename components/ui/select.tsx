import React from "react";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function Select({ value, onValueChange, children, className }: SelectProps) {
  // Find all SelectItem children and render as <option>
  const options = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.type === SelectContent)
    .flatMap(child =>
      React.Children.toArray((child as React.ReactElement<any>).props.children)
        .filter(option => React.isValidElement(option) && option.type === SelectItem)
    );

  // Find the placeholder (SelectValue)
  const placeholder = React.Children.toArray(children)
    .filter(child => React.isValidElement(child) && child.type === SelectTrigger)
    .flatMap(child =>
      React.Children.toArray((child as React.ReactElement<any>).props.children)
        .filter(val => React.isValidElement(val) && val.type === SelectValue)
    )[0];

  return (
    <select
      value={value}
      onChange={e => onValueChange(e.target.value)}
      className={className}
    >
      {placeholder}
      {options}
    </select>
  );
}

export function SelectTrigger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <>{children}</>;
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <option value="">{placeholder}</option>;
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}