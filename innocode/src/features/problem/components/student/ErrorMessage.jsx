import React from "react";
import { Icon } from "@iconify/react";

/**
 * Reusable error/success message component
 */
const ErrorMessage = ({ type = "error", title, message }) => {
  const config = {
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "mdi:alert-circle",
      iconColor: "text-red-600",
      titleColor: "text-red-800",
      messageColor: "text-red-600",
    },
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "mdi:check-circle",
      iconColor: "text-green-600",
      titleColor: "text-green-800",
      messageColor: "text-green-600",
    },
    warning: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      icon: "mdi:alert",
      iconColor: "text-yellow-600",
      titleColor: "text-yellow-800",
      messageColor: "text-yellow-600",
    },
  };

  const style = config[type] || config.error;

  // Không render nếu không có message (title không đủ để hiển thị)
  if (!message) return null;

  return (
    <div className={`mt-4 p-4 ${style.bg} border ${style.border} rounded-lg`}>
      <div className="flex items-start gap-3">
        <Icon
          icon={style.icon}
          className={`flex-shrink-0 mt-0.5 ${style.iconColor}`}
          width={20}
        />
        <div className="flex-1">
          {title && (
            <p className={`font-semibold ${style.titleColor} mb-1`}>{title}</p>
          )}
          {message && (
            <p className={`text-sm ${style.messageColor}`}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;

