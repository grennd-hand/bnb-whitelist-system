import React, { useState, useEffect } from "react";
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from "react-icons/fi";
import { cn } from "@/lib/utils";

export type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationProps {
  type: NotificationType;
  message: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  className?: string;
}

const iconMap = {
  success: FiCheck,
  error: FiX,
  info: FiInfo,
  warning: FiAlertTriangle,
};

const colorMap = {
  success: "border-cyber-green bg-cyber-dark text-cyber-green",
  error: "border-cyber-red bg-cyber-dark text-cyber-red",
  info: "border-cyber-blue bg-cyber-dark text-cyber-blue",
  warning: "border-cyber-yellow bg-cyber-dark text-cyber-yellow",
};

export function Notification({
  type,
  message,
  description,
  duration = 5000,
  onClose,
  className,
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconMap[type];

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "cyber-panel fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2 border-l-4 p-4 shadow-lg",
        colorMap[type],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          <p className="font-cyber text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            if (onClose) onClose();
          }}
          className="rounded-full p-1 hover:bg-cyber-dark hover:text-cyber-blue"
        >
          <FiX className="h-4 w-4" />
        </button>
      </div>
      {description && <p className="text-xs opacity-80">{description}</p>}
    </div>
  );
}