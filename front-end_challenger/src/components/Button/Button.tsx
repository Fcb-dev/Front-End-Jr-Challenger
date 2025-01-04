import React from "react";
import styles from "./index.module.css";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "success" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
}) => {
  const variantClass = styles[`button${variant[0].toUpperCase()}${variant.slice(1)}`];
  const sizeClass = styles[size];

  const buttonClasses = `${styles.button} ${variantClass || ""} ${sizeClass || ""}`;

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;