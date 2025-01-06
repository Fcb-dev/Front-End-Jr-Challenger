import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "success" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  type: "button" | "submit";
  error?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      onClick,
      variant = "primary",
      size = "medium",
      disabled = false,
      type,
      error = false,
      icon,
      iconPosition = "left",
    },
    ref
  ) => {
    const variantClass = styles[`Button${variant[0].toUpperCase()}${variant.slice(1)}`];
    const sizeClass = styles[size];
    const buttonClasses = `${styles.Button} ${variantClass || ""} ${sizeClass || ""} ${error ? styles.ErrorButton : ""}`;

    return (
      <button
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled || error}
        type={type}
        ref={ref}
      >
        {icon && iconPosition === "left" && <span className={styles.Icon}>{icon}</span>}
        <span>{label}</span>
        {icon && iconPosition === "right" && <span className={styles.Icon}>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";