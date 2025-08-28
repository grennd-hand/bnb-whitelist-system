import React from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-current border-t-transparent text-cyber-blue",
          sizeClasses[size]
        )}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className={cn("h-2 w-2 rounded-full bg-cyber-blue", {
          "h-1 w-1": size === "sm",
          "h-3 w-3": size === "lg",
        })} />
      </div>
    </div>
  );
}